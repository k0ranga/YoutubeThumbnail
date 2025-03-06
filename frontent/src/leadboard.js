import React, { useState, useEffect } from 'react';

function leaderboard(){
    const [leaders, serLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderBoard = async() => {
        try{
            const response = await fetch('http://localhost:5000/api/profiles/leaderboard');
            const data = await response.json();
            setLeader(data);
            setLoading(false);
            }catch(error){
                console.error('ERROR Fetching leaderboard', error);
                setLoading(false);
             }
        };


        useEffect(() =>{
            fetchLeaderboard();

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
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Rating</th>
                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Votes</th>
                </tr>
            </thead>
            <tbody>
                {leaders.map((profile, index) => (
                    <tr key={profile.id}>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.full_name}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.rating}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.votes}</td>
                    </tr>
                ))}
             </tbody>
             </table>
             </div>
             );
        }
export default Leaderboard;
