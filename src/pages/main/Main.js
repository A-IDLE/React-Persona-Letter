function App() {
  return (
    <div className="series-container">
      <h2>Harry Potter series</h2>
      <div className="character-row">
        <CharacterButton characterName="Harry Potter" />
        <CharacterButton characterName="Hermione Granger" />
        <CharacterButton characterName="Ron Weasley" />
        <CharacterButton characterName="Ginny Weasley" />
        <CharacterButton characterName="Severus Snape" />
        <CharacterButton characterName="Luna Lovegood" />
      </div>

      <h2>The Walking Dead</h2>
      <div className="character-row">
      <CharacterButton characterName="Glenn Rhee" />
      <CharacterButton characterName="Daryl Dixon" />
      <CharacterButton characterName="Michonne" />
      <CharacterButton characterName="Carl Grimes" />
      <CharacterButton characterName="Carol Peletier" />
      <CharacterButton characterName="Maggie Greene" />
      </div>
    </div>
  );
}

export default App;

const CharacterButton = ({ characterName }) => {

  const imageUrl = `/images/main/${characterName}.jpg`; // Construct the image URL

  return (
    <div className="character">
      <img src={imageUrl} alt={characterName} />
      <p>{characterName}</p>
    </div>
  );
}
