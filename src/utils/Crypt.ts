import * as bcrypt from "bcryptjs"

export const CryptText = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) reject(err);
            bcrypt.hash(password, salt, (err, hash: string) => {
                if(err) return reject(err);
                return resolve(hash);
            })
        })
    })
}

export const CheckCryptText = (textCrypted: string, textNonCrypted: string): Promise<boolean> => {
    console.log(textCrypted, textNonCrypted);
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(textNonCrypted, textCrypted, (err, same) => {
            if(err) reject(err);
            resolve(same);
        })
    })
}

