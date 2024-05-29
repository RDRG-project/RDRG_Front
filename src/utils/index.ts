// descript: yyyy-MM-dd
export const dateFormat = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
// descript: yyyy-MM-dd hh:00:00
export const dateTimeFormat = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}`;

export const convertUrlToFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const extd = url.split('.').pop();
    const fileName = url.split('/').pop();
    const meta = { type: `image/${extd}` };

    return new File([data], fileName as string, meta);    
};