
function getBrand(){
    return localStorage.getItem("brand_uuid")
}

function getCollectionCode() {
    return localStorage.getItem("collection_code")
}

function removeBrand() {
  localStorage.removeItem("brand_uuid")
}

function removeCollectionCode() {
  localStorage.removeItem("collection_code")
}

const API_URL = "https://rocket-order.com/api"

export { getBrand, getCollectionCode, API_URL, removeBrand, removeCollectionCode };
