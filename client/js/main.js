let page = 1;

async function _fetch(pg) {
  const req = await fetch("/api/?page=" + pg);
  const data = await req.json();
  const current_page = data.page;
  const news_list = data.news_list;

  Array.from(news_list).forEach((e) => {
    if (
      e.headline.length > 0 &&
      e.thumbnail.length > 0 &&
      e.description.length > 0
    ) {
      const parentElm = document.querySelector("#news-div");

      const createDiv1 = document.createElement("div");
      createDiv1.setAttribute("class", "contain_img");

      const createDiv2 = document.createElement("div");
      createDiv2.setAttribute("class", "contain_details");

      const createImg = document.createElement("img");
      createImg.setAttribute("class", "thumbnail");
      createImg.src = e.thumbnail;

      createDiv1.append(createImg);

      const createHeading = document.createElement("span");
      createHeading.setAttribute("class", "headline");
      createHeading.textContent = e.headline;

      const createDesc = document.createElement("p");
      createDesc.setAttribute("class", "description");
      createDesc.textContent = e.description;

      const createLink = document.createElement("a");
      createLink.href = e.link;
      createLink.target = "_blank";
      createLink.textContent = "Read More";

      const createDate = document.createElement("span");
      createDate.setAttribute("class", "datetime");

      if (e.source == "https://scroll.in/latest/") {
        createDate.textContent =
          Date(new Date(e.uploaded_time)).split(
            new Date(e.uploaded_time).getFullYear()
          )[0] +
          ", " +
          new Date(e.uploaded_time).getFullYear() +
          " " +
          new Date(e.uploaded_time).toLocaleTimeString("en-US", {
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          });
      } else {
        createDate.textContent = e.uploaded_time;
      }

      const createSource = document.createElement("a");
      createSource.href = e.source;
      createSource.setAttribute("class", "news_source");
      createSource.textContent = e.source;

      createDiv2.append(
        createHeading,
        createDesc,
        createDate,
        createLink,
        createSource
      );

      const parentDiv2 = document.createElement("div");

      parentDiv2.append(createDiv1, createDiv2);

      parentElm.append(parentDiv2);
    }
  });
}

_fetch(page);

function loadMore() {
  page += page;
  _fetch(page);
}
