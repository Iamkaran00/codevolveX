export const formattedDate = date =>{
    return new Date(data).toLocaleDateString('en-US',{
        month : "long",
        day : "numeric",
        year : "numeric"
    })
}