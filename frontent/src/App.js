import React, { useState, useEffect } from 'react';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPair, setCurrentPair] = useState([]);

  const fetchProfiles = async() => {
    try{
        const response = await fetch('http://localhost:5000/api/profiles');
        const data = await response.json();
        setProfiles(data);
        setLoading(false);
        selectRandomPair(data);
    } catch(error) {
        console.error('ERROR fetching prfiles', error);
        setLoading(false);
    }
  };
  
  const selectRandomPair = (list) =>{
    if(list.length < 2){
        setCurrentPair([])
        return;
    }
    const index1 = Math.floor(Math.random() * list.length);
    let index2 = Math.floor(Math.random() * list.length);
    while (index2 === index1) {
         index2 = Math.floor(Math.random() * list.length);
    }
    setCurrentPair([list[index1], list[index2]]);
   };
  
  useEffect(() => {
      fetchProfiles();
   }, []);
   useEffect(() => {
     console.log(profiles); // Check the whole profiles array in the console
     }, [profiles]);


  const handleVote = async (winnerId, loserId) =>{
    try{
        const response = await fetch('http://localhost:5000/api/profiles/elo-vote',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({winnerId, loserId}),
    });
    const data = await response.json();
    console.log('VOTE updated', data);
    await fetchProfiles();
    } catch(error){
        console.error('ERROR VOTING:', error);
    }
   };
   if(loading){
    return <div style={{ textAlign: 'center' }}>Loading profiles...</div>;
   }
   if (currentPair.length < 2) {
    return <div style={{ textAlign: 'center' }}>Not enough profiles to compare.</div>;
   }



  return (
     <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Comparison</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {currentPair.map((profile, index) => (
                <div
                    key={profile.id}
                    style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    width: '320px',
                    }}
                >
                <h3>{profile.full_name}</h3>
                <img
                    src={profile.face_image_url}
                    alt={profile.full_name}
                    width="300"
                    style={{ marginBottom: '10px' }}
                />
                <p>Rating: {profile.rating}</p>
                <p>Votes: {profile.votes}</p>
                <button
                    onClick={() => {
                        if (index === 0) {
                            handleVote(currentPair[0].id, currentPair[1].id);
                        } else {
                            handleVote(currentPair[1].id, currentPair[0].id);
                        }
                       }}
                >
                Vote
                </button>
                </div>
           ))}
           </div>
           <button
            onClick={() => selectRandomPair(profiles)}
            style={{marginTop: '20px' }}
           >
           skip & compare New Pair
           </button>
           </div>
    );
}

export default App;
