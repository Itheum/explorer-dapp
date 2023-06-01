import React, { useEffect, useState } from "react";
import "./PlaystationGamerInsights.css";

const tileImageMap = {
  "Cult of the Lamb":
    "https://image.api.playstation.com/vulcan/ap/rnd/202303/0118/aad08988426ab337e52d795048a35821930cded408a54506.png",
  "Little Nightmares II":
    "https://image.api.playstation.com/vulcan/ap/rnd/202010/0108/uxdypYdPjRXXKfSc1CxiLClp.png?w=440&thumb=false",

  "Bloodborne™":
    "https://image.api.playstation.com/vulcan/img/rnd/202011/2320/E3hXKQ8iL9BJtAT8gR9nmIMF.png?w=440&thumb=false",
  "Detroit: Become Human™":
    "https://image.api.playstation.com/vulcan/img/rnd/202010/2119/wl4DB5QGzlEHAXy1KLUVgOAu.png?w=440&thumb=false",
  "STAR WARS Jedi: Fallen Order™":
    "https://image.api.playstation.com/vulcan/img/rnd/202105/1714/WHeOu95nW2SZQy6H5IKgE2Bg.png?w=440&thumb=false",
  "It Takes Two PS4™ & PS5™":
    "https://image.api.playstation.com/vulcan/ap/rnd/202012/0815/7CRynuLSAb0vysSC4TmZy5e4.png?w=440&thumb=false",
  "Lara Croft and the Temple of Osiris":
    "https://image.api.playstation.com/cdn/EP0082/CUSA00806_00/nnjRpnMH63WwolTeln9pmdAmgyuj73bq.png?w=440&thumb=false",
  "Middle-earth™: Shadow of Mordor™":
    "https://image.api.playstation.com/cdn/EP1018/CUSA00053_00/aPFMbLkBLH4r9X13e2H7QwdL0l6BGoTu.png?w=440&thumb=false",

  "EA SPORTS™ FIFA 23":
    "https://image.api.playstation.com/vulcan/ap/rnd/202301/0312/yM0eeJui8AFByeP5BC5XV5j9.png?w=440&thumb=false",
  "God of War Ragnarök":
    "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png?w=440&thumb=false",
  Stray:
    "https://image.api.playstation.com/vulcan/ap/rnd/202206/0300/E2vZwVaDJbhLZpJo7Q10IyYo.png?w=440&thumb=false",
  "Shadow of the Tomb Raider": "",
  "LEGO® Harry Potter™ Collection": "",
  "Rocket League®": "",
  "Rise of the Tomb Raider": "",
  "Tomb Raider: Definitive Edition": "",
  "Overcooked! All You Can Eat": "",
  "NARUTO SHIPPUDEN: Ultimate Ninja STORM TRILOGY": "",
  "Little Nightmares": "",
  "inFAMOUS™ Second Son": "",
};

function PlaystationGamerInsights({ gamerId, gamerData }) {
  return (
    <>
      <div>
        {/* <div>Gamer: {gamerId}</div> */}

        <div className="section-container">
          <h2>Gamer's Playstation Platform:</h2>
          <div className="platform">
            <div>
              Gamer's Device: {gamerData.account_devices[0].device_type}{" "}
              {gamerData.account_devices[0].activation_type}
            </div>
            <div>
              Activated On: {gamerData.account_devices[0].activation_date}
            </div>
            <div>Languages: {gamerData.profile_legacy.languages_used[0]}</div>
            <div>Playstation Plus? : YES</div>
          </div>
        </div>

        <div className="section-container">
          <h2>Gamer's Trophy Summary:</h2>
          <div className="trophies">
            {Object.keys(gamerData.trophy_summary).map((key, idx) => (
              <div key={idx} className="trophy">
                {key} : {gamerData.trophy_summary[key]}
              </div>
            ))}
          </div>
        </div>

        <div className="section-container">
          <h2>Gamer's Titles:</h2>
          <div className="titles">
            {gamerData.title_stats.map((item, idx) => (
              <div key={idx} className="title-row">
                <h3>{item.name}</h3>
                <img
                  src={
                    tileImageMap[item.name] ||
                    "https://www.goldenpond.com/wp-content/uploads/2020/12/Image-Coming-Soon-400x400-1.jpg"
                  }
                ></img>
                <div className="title-item">Category: {item.category}</div>
                <div className="title-item">
                  First Played: {item.first_time_played}
                </div>
                <div className="title-item">
                  Last Played: {item.last_time_played}
                </div>
                <div className="title-item">
                  Played : {item.play_count} times
                </div>
                <div className="title-item">Play Time :{item.play_time}</div>

                <div className="title-trophies">
                  <h4>Achievements:</h4>
                  {(gamerData?.titleAndTrophies[item.name]?.trophies && (
                    <div>
                      <div className="trophy-item">
                        total_items_count:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .total_items_count
                        }
                      </div>
                      <div className="trophy-item">
                        service:{" "}
                        {gamerData.titleAndTrophies[item.name].trophies.service}
                      </div>
                      <div className="trophy-item">
                        id: {gamerData.titleAndTrophies[item.name].trophies.id}
                      </div>
                      <div className="trophy-item">
                        detail:{" "}
                        {gamerData.titleAndTrophies[item.name].trophies.detail}
                      </div>
                      <div className="trophy-item">
                        progress:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .progress
                        }
                      </div>
                      <div className="trophy-item">
                        earned_bronze:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .earned_bronze
                        }
                      </div>
                      <div className="trophy-item">
                        earned_silver:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .earned_silver
                        }
                      </div>
                      <div className="trophy-item">
                        earned_gold:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .earned_gold
                        }
                      </div>
                      <div className="trophy-item">
                        earned_platinum:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .earned_platinum
                        }
                      </div>
                      <div className="trophy-item">
                        defined_bronze:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .defined_bronze
                        }
                      </div>
                      <div className="trophy-item">
                        defined_silver:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .defined_silver
                        }
                      </div>
                      <div className="trophy-item">
                        defined_gold:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .defined_gold
                        }
                      </div>
                      <div className="trophy-item">
                        defined_platinum:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .defined_platinum
                        }
                      </div>
                      <div className="trophy-item">
                        date_of_last_trophy:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .date_of_last_trophy
                        }
                      </div>
                      <div className="trophy-item">
                        title_id:{" "}
                        {
                          gamerData.titleAndTrophies[item.name].trophies
                            .title_id
                        }
                      </div>
                    </div>
                  )) ||
                    "None"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaystationGamerInsights;
