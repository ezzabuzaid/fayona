import fileSystem = require('fs');
import path = require('path');
import { Application } from 'app/app';

export class UploadsHelper {
    static folderPath(id: string) {
        return path.join(Application.uploadDirectory, id);
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
