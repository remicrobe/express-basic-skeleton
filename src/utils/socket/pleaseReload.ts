import {Index} from "../../index";

export function pleaseReload(userId: number | number[], context: string, id: number, mainId: number = 0) {
    let formattedUser: string | string[] = [];

    if (Array.isArray(userId)) {
        formattedUser = userId.map(uid => uid.toString());
    } else {
        formattedUser = userId.toString();
    }

    Index.io.to(formattedUser).emit('update', {
        context,
        id,
        mainId
    })
}
