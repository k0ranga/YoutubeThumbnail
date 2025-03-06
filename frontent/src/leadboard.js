import React, { useState, useEffect } from 'react';

function Leaderboard(){
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderBoard = async() => {
        try{
            const response = await fetch('http://localhost:5000/api/profiles/leaderboard');
            const data = await response.json();
            setLeaders(data);
            setLoading(false);
            }catch(error){
                console.error('ERROR Fetching leaderboard', error);
                setLoading(false);
             }
        };


        useEffect(() =>{
            fetchLeaderBoard();

        }, []);

        if(loading){
            return <div style={{ textAlign: 'center' }}> Loading leaderboard...</div>
        }

        return(
             <div style={{ textAlign: 'center', padding: '20px' }}>
             <h2>Leaderboard</h2>
             <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Rank</th>
                   <th style={{ border: '1px solid #ccc', padding: '8px' }}>Face</th>
                   <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Rating</th>
                </tr>
            </thead>
            <tbody>
                {leaders.map((profile, index) => (
                    <tr key={profile.id}>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                          <img src={profile.face_image_url} alt={profile.full_name} width="100" />
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.full_name}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.rating}</td>
                    </tr>
                ))}
             </tbody>
             </table>
             </div>
             );
        }
export default Leaderboard;
