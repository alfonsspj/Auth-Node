const bcrypt = require('bcrypt');

async function verifyPassword() {
    const myPassword = 'admin 123 .202';
    const hash = '$2b$10$xV8B7m14ffKM/526nrYnm.LidCHvnj5EKztKmkerrwfPQ4.2Jw.vS';
    const isMatch = await bcrypt.compare(myPassword, hash);
    console.log(isMatch);
}

verifyPassword();
