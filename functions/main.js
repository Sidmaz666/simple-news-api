const axios = require('axios')
const cheerio = require('cheerio')

const source_url_1 = "https://scroll.in/"
const source_url_2 = "https://indianexpress.com/"
const source_url_3 = "https://www.ndtv.com/"


const axios_config = {
   headers : {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
    }
  }


async function latest_news(res,page){


  const req = await axios.all([
    axios.get(source_url_1 + 'latest/page/' + page, axios_config),
    axios.get(source_url_2 + 'latest-news/page/' + page, axios_config),
    axios.get(source_url_3 + 'latest', axios_config)
  ])

  const raw_html =  {
    req_1: await req[0].data,
    req_2 : await req[1].data,
    req_3 : await req[2].data
  }

  let $ = cheerio.load(raw_html.req_1)

  const news_list = []

  $('li.row-story').each(function(){
    const headline = $(this).find('h1[itemprop="headline about"]').text()
    const description = $(this).find('h2[itemprop="description"]').text()
    const uploaded_time = $(this).find('time[itemprop="datePublished"]').attr('datetime')
    const thumbnail = $(this).find('img').attr('src')
    const link = $(this).find('a').attr('href')
    news_list.push({
      headline,
      description,
      uploaded_time,
      thumbnail,
      link,
      source : `${source_url_1}latest/`
    })
  })

  $ = cheerio.load(raw_html.req_2)

  $('.nation > .articles').each(function(){
    const headline = $(this).find('div.title').text()
    const description = $(this).find('p').text()
    const uploaded_time = $(this).find('div.date').text().replace('Updated: ', '')
    const thumbnail = $(this).find('noscript').text().replace(/\<img.*src\=\"/g,'').replace(/\" class.*/g,'')
    const link = $(this).find('a').attr('href')
    news_list.push({
      headline,
      description,
      uploaded_time,
      thumbnail,
      link,
      source : `${source_url_2}latest-news/`
    })
  })


   $ = cheerio.load(raw_html.req_3)

  $('div.news_Itm').each(function(){
    const headline = $(this).find('h2.newsHdng').text()
    const description = $(this).find('p.newsCont').text()
    const uploaded_time = $(this).find('span.posted-by').text().replace(/.*\| /g, '').trim()
    const thumbnail = $(this).find('div.news_Itm-img').find('img').attr('src')
    const link = $(this).find('a').attr('href')
    news_list.push({
      headline,
      description,
      uploaded_time,
      thumbnail,
      link,
      source : `${source_url_3}latest/`
    })
  })

  res.status(200).json({
    page : page,
    news_list
  })
}

module.exports = {
  latest_news
}
