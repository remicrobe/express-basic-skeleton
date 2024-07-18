export function checkRequiredField(fields: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour vérifier le format de l'email
    const minPasswordLength = 8; // Longueur minimale pour le mot de passe

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];

        if (typeof field === 'object') {
            switch (field.type) {
                case 'mail':
                    if (!field.object || !emailRegex.test(field.object)) {
                        return false;
                    }
                    break;
                case 'username':
                    if (!field.object || typeof field.object !== 'string' || field.object.trim() === '') {
                        return false;
                    }
                    break;
                case 'name':
                    if (!field.object || typeof field.object !== 'string' || field.object.trim() === '') {
                        return false;
                    }
                    break;
                case 'password':
                    if (!field.object || typeof field.object !== 'string' || field.object.length < minPasswordLength) {
                        return false;
                    }
                    break;
                default:
                    if (!field.object) {
                        return false;
                    }
                    break;
            }
        } else {
            if (!field) { // Vérifie si le champ est null, undefined ou ''
                return false;
            }
        }
    }
    return true;
}


export function statusMsg(status: number, msg: string) {
    return  { status, msg }
}