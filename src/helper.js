
function getBrand(){
    return localStorage.getItem("brand_uuid")
}

function getCollectionCode() {
    return localStorage.getItem("collection_code")
}

const API_URL = "http://192.168.1.138:8000/api"

export { getBrand, getCollectionCode, API_URL };
