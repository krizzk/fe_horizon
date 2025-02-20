import Cookies from "js-cookie";

export const getCookie = (key: string) => {
   return Cookies.get(key)
}

export const storeCookie = (key: string, plainText: string) => {
   Cookies.set(key, plainText, { expires: 1 })
}

export const removeCookie = (key: string) => {
   Cookies.remove(key)
}



//Uji coba di storeCookie supaya di simpan mirip seperti get di postman
// export function storeCookie(name: string, value: string) {
//    // Format the JSON string with indentation before storing
//    try {
//      const parsedValue = JSON.parse(value)
//      const formattedValue = JSON.stringify(parsedValue, null, 2)
//      document.cookie = `${name}=${encodeURIComponent(formattedValue)}; path=/`
//    } catch {
//      // If parsing fails, store the original value
//      document.cookie = `${name}=${encodeURIComponent(value)}; path=/`
//    }
//  }
 
//  export function getCookie(name: string): string | null {
//    const cookies = document.cookie.split(";")
//    for (const cookie of cookies) {
//      const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim())
//      if (cookieName === name) {
//        try {
//          // Parse and re-format the JSON string when retrieving
//          const decodedValue = decodeURIComponent(cookieValue)
//          const parsedValue = JSON.parse(decodedValue)
//          return JSON.stringify(parsedValue, null, 2)
//        } catch {
//          return decodeURIComponent(cookieValue)
//        }
//      }
//    }
//    return null
//  }
 
//  export function removeCookie(name: string) {
//    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
//  }
 
 