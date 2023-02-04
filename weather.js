const formJQ = $("form").eq(0);
const inputJQ = $("input");
const msgJQ = $(".msg");
const listJQ = $(".ajax-section .cities");

localStorage.setItem(
  "apiKey",
  "+lSD63jYEwbnNUNAL2XqDucMfucgfr5GdgE8bB34NYZRciAJCk090SNmeKakXIls"
);

formJQ.submit((e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  const cityNameInput = inputJQ.val();
  const units = "metric";
  const lang = "tr";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${apiKey}&units=${units}&lang=${lang}`;
  //jquery http request
  //const response = await $.get(url);
  //const response = await $.post(url);
  await $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: (response) => {
      console.log(response);
      //weather card
      const { main, sys, weather, name } = response;
      const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
      //alternative iconUrl
      const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      const cityCardList = listJQ.find(".city");
      const createdLi = $("<li></li>");
      const cityCardListArray = cityCardList.get();
      if (cityCardListArray.length > 0) {
        const filteredArray = cityCardListArray.filter(
          (card) => $(card).find("span").text() == name
        );
        if (filteredArray.length > 0) {
          msgJQ.text(
            `You already know the weather for ${name}, Please search for another city 😉`
          );
          //styling
          msgJQ.css({ color: "red", "text-decoration": "underline" });
          setTimeout(() => {
            msgJQ.text(``);
          }, 3000);
          formJQ.trigger("reset");
          return;
        }
      }

      createdLi.addClass("city");
      createdLi.html(
        `<h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}
                    <sup>°C</sup>
            </div>
            <figure>
                <img class="city-icon" src="${iconUrlAWS}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`
      );
      listJQ.prepend(createdLi);
      formJQ.trigger("reset");
      $(".city").click((e) => {
        $(e.target)
          .animate({ left: "50px" })
          .animate({ left: "150px" })
          .animate({ left: "250px" })
          .animate({ left: "150px" })
          .animate({ left: "50px" })
          .animate({ left: "0px" });
      });

      $(".city img").click((e) => {
        $(e.target).slideUp(1500).slideDown(1500);
      });

      // $(".city img").click((e)=>{
      //     $(e.target)
      //     .hide()
      // });
    },
    beforeSend: (request) => {
      //parameter => headers
      //send tokenKey
    },
    complete: () => {},
    error: (XMLHttpRequest) => {
      //error handling
      msgJQ.text(
        `You already know the weather for ${name}, Please search for another city 😉`
      );
      //styling
      msgJQ.css({ color: "red", "text-decoration": "underline" });
      setTimeout(() => {
        msgJQ.text(``);
      }, 3000);
      formJQ.trigger("reset");
    },
  });
};
