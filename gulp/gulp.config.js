module.exports.configuration = {
    paths: {
        src: {
            entry: 'src',
            get ts() {
                return [`${this.entry}/**/*.ts`]
            }
        },
        dist: {
            entry: 'dist',
            get js() {
                return [`${this.entry}/**/*.js`]
            },
        }
    }
};