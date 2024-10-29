export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * The function generateVerificationCode is intended to generate a random six-digit verification code. the function will return a string representation of a random integer between 100000 and 999999, which is suitable for use as a verification code.
 */