import axios from "axios"

export const getProvince = () => {
    //get province list from https://provinces.open-api.vn/api/p/
    return axios.get('https://provinces.open-api.vn/api/p/')
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error("Error fetching province data:", error)
            throw error
        })
}