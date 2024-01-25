import axios from "axios";

export async function validarURL(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}