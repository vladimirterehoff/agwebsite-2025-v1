export const phoneClean = (phone: any) => {
    return typeof phone === 'string' ? phone.replace(/[\(\)\-\s]/g, '') : phone;
}