import fileSystem = require('fs');
import path = require('path');

export class Directories {
    static getTemplate(templatePath: string) {
        const fullPath = path.join(Directories.staticDirectory, templatePath + '.html');
        return fileSystem.readFileSync(fullPath, 'utf8');
    }

    public static staticDirectory = path.join(process.cwd(), 'src', 'public');
    public static uploadDirectory = path.join(process.cwd(), 'uploads');

    static folderPath(id: string) {
        return path.join(Directories.uploadDirectory, id);
    }

    static removeFolder(id: string) {
        const folderPath = this.folderPath(id);
        if (fileSystem.existsSync(folderPath)) {
            fileSystem.readdirSync(folderPath)
                .forEach((entry) => {
                    const entryPath = path.join(folderPath, entry);
                    if (fileSystem.lstatSync(entryPath).isDirectory()) {
                        this.removeFolder(entryPath);
                    } else {
                        fileSystem.unlinkSync(entryPath);
                    }
                });
            fileSystem.rmdirSync(folderPath);
        } else {
            return null;
        }
    }

    static createFolderDirectory(id: string) {
        fileSystem.mkdirSync(this.folderPath(id), { recursive: true });
    }

}
