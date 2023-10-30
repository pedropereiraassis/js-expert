class Service {
  async makeRequest(url) {
    return (await fetch(url)).json()
  }

  async getPlanets(url) {
    const data = await this.makeRequest(url)
    return {
      name: data.name,
      surfaceWater: data.surface_water,
      appearsIn: data.films.length,
    }
  }
}

module.exports = Service