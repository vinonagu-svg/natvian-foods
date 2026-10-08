import React from "react";

const videos = [
  "I33KFqYxg9c",
  "3kGOCfr6uRE",
  "qVSFwZcLYu4",
  "BJc3TB5YLIk",
  "_8E0d-8TgEs",
  "Y49zyB8dT54",
  "BgmQN2EZ6ME"
];

function YouTubeShorts({ language }) {
  return (
    <section
      id="youtube-shorts"
      className="max-w-7xl mx-auto px-6 py-16"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {language === "ta"
            ? "எங்கள் குட்டி வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள் ❤️"
            : "What Our Little Customers Say ❤️"}
        </h2>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          {language === "ta"
            ? "நேட்டிவியன் உணவுகளை சுவைத்து மகிழும் குழந்தைகளின் உண்மையான கருத்துகளைப் பாருங்கள்."
            : "Hear real feedback from children enjoying Natvian Foods."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map(function (videoId) {
          return (
            <div
              key={videoId}
              className="w-full max-w-xs mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="relative w-full aspect-[9/16] bg-black">
                <iframe
                  src={"https://www.youtube.com/embed/" + videoId}
                  title="Natvian Foods Children Feedback"
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <a
          href="https://www.youtube.com/@Thenativefooddotcom"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200"
        >
          {language === "ta"
            ? "YouTube-ல் மேலும் பார்க்கவும்"
            : "Watch More on YouTube"}
        </a>
      </div>
    </section>
  );
}

export default YouTubeShorts;