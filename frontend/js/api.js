

const api = {
 
  getTypes() {
    return axios.get(`${API_URL}/types/`).then((res) => res.data);
  },
  createType(payload) {
    return axios.post(`${API_URL}/types/`, payload).then((res) => res.data);
  },
  updateType(id, payload) {
    return axios.put(`${API_URL}/types/${id}`, payload).then((res) => res.data);
  },
  deleteType(id) {
    return axios.delete(`${API_URL}/types/${id}`);
  },

  
  getPokemon() {
    return axios.get(`${API_URL}/pokemon/`).then((res) => res.data);
  },
  createPokemon(payload) {
    return axios.post(`${API_URL}/pokemon/`, payload).then((res) => res.data);
  },
  updatePokemon(id, payload) {
    return axios.put(`${API_URL}/pokemon/${id}`, payload).then((res) => res.data);
  },
  deletePokemon(id) {
    return axios.delete(`${API_URL}/pokemon/${id}`);
  },
  uploadPokemonImage(id, formData) {
    return axios
      .post(`${API_URL}/pokemon/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};


function extractErrorMessage(err, fallback) {
  return err.response?.data?.detail
    ? JSON.stringify(err.response.data.detail)
    : fallback;
}