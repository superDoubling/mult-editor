module.exports = {
    randString(number) {
        const ALL_CHAR = 'qwertyuiopasdfghjklzxcvbnm1234567890';
        const len = ALL_CHAR.length;
        let output = '';
        for (let i = 0; i < number; i++) {
            output += ALL_CHAR[Math.floor(Math.random() * len)];
        }
        return output;
    },
}
