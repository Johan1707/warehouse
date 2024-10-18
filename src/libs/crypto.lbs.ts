const DS: string = 'YP-C4S'
const RADIX: number = 16


export const passwordHash = async (password: string, providedSalt?: Uint8Array): Promise<string> => {
    const encoder: TextEncoder = new TextEncoder()
    const salt: Uint8Array = providedSalt || crypto.getRandomValues( new Uint8Array(RADIX) )
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey'],
    )
    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'],
    )
    const exportedKey: ArrayBuffer = (await crypto.subtle.exportKey('raw', key)) as ArrayBuffer
    const hashBuffer: Uint8Array = new Uint8Array(exportedKey)
    const hashArray: number[] = Array.from(hashBuffer)
    const hashHex: string = hashArray.map((b: number) => b.toString(RADIX).padStart(2, '0')).join('')
    const saltHex: string = Array.from(salt).map((b: number) => b.toString(RADIX).padStart(2, '0')).join('')
    return `${ hashHex }${ DS }${ saltHex }`
}

export const passwordVerify = async (hashedPassword: string, password: string): Promise<boolean> => {
    const [originalHash, saltHex]: string[] = hashedPassword.split(DS)
    const matchResult: RegExpMatchArray | null = saltHex.match(/.{1,2}/g)
    if(!matchResult) {
        return false
    }
    const salt: Uint8Array = new Uint8Array(matchResult.map((byte: string) => parseInt(byte, RADIX)))
    const attemptHashWithSalt: string = await passwordHash(password, salt)
    const [attemptHash]: string[] = attemptHashWithSalt.split(DS)
    return attemptHash === originalHash
}

export const generatePassword = (length: number = 12): string => {
    let result: string = ''
    const characters: string = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
    const size: number = characters.length
    for(let i: number = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * size))
    }
    return result
}