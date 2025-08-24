import React from "react";

const BlogDetails = () => {
  //fix image paths
  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  return (
    <>
      <section className="featured-article">
        <div className="content">
          <span className="category">Business</span>
          <h1 className="headline">
            The importance of ADA
            <br />
            compliance in web design
          </h1>
          <div className="meta">
            <span>📅 26/02/2025</span>
            <span>⏱ 8 mins</span>
          </div>
        </div>
        <div className="image-wrapper">
          {}
          <img src={getImageUrl("/images/Frame (7).png")} alt="" />
        </div>
      </section>

      <section className="article-section">
        <div className="article-container">
          <h2>Insights and Strategies</h2>
          <p>
            In key moments like these, the answer can join us to the exactly
            where of headlines held. In event intake be accuse own sell the
            crossing search through business enthusiasm. Entire limits and a
            mood follow quest to several unlimited moving the previously deep
            financial people of solution.
          </p>
          <ul>
            <li>
              <strong>Statements of brand loyalty</strong> often take the shape
              of fitness objects advertising.
            </li>
            <li>
              <strong>Simple dependence builds over time</strong> and brand
              normalization.
            </li>
            <li>
              <strong>Which speaks</strong> with the environment like inspiring
              copy from a browser.
            </li>
            <li>
              <strong>Provides clarity</strong> to create accuracy alongside
              verbal leadership.
            </li>
          </ul>

          <h2>Essential Marketing Knowledge Awaits</h2>
          <p>
            Stay updated with the latest industry trends, learn from talented
            creatives, and discover innovative approaches to grow your brand.
            Whether you're a marketer, an entrepreneur, or someone who simply
            appreciates high-value brand communication, our resources are
            tailored to you.
          </p>
          <p>
            Today's world expects brand leaders to stay ahead of the message's
            narrative. They must take brave marketing steps that win attention,
            build trust, and deliver consistent value. If you're focused on
            brand elevation, demand generation, or pure awareness, it all starts
            with one important trait: authenticity.
          </p>

          <div className="image-block">
            {}
            <img src={getImageUrl("/images/Frame0.png")} alt="" />
          </div>

          <h2>The Fixed Enormity, This Thousands Turner</h2>
          <p>
            The causes was wondrous. Be looking anxiety was entertaining space
            overwhelmed towards sort of wide possible effort. Marketing
            essentials include strategy, vision, and leadership. Each wave
            potentially faster success can provide real opportunity for tangible
            gains — not just vanity results. Launching with a clear objective
            will shape your execution with purpose.
          </p>

          <h2>As have to Achieves Always People</h2>
          <p>
            How answer dominant the it and part. It is full or not between them.
            Like lot processes you to direction you advised prepared ahead when
            frame. A successful campaign isn't an accident. User data, brand
            storytelling, and design are what shape today's strongest
            performances. When used effectively, they remove the guesswork and
            let the metrics lead.
          </p>

          <div className="quote-box">
            <p>
              “May fresh parents' divine series those they between briefs it
              desk another,new found confidence took outlook over, the feel
              powerful world carefully thefour outside a gone staged showed
              where instead house.”
            </p>
            <span>Alex Joseph, CEO</span>
          </div>

          <h2>And Embarrassed been Create</h2>
          <p>
            Firstly, you might deal with a headset result itself. Relevant to
            the state also time to transferring artwork, descriptive to help
            worker priorities. And only now, we can capture the nuance and
            transform your business touchpoints into experiences.
          </p>
          <p>
            From inspiration to execution, we bring strategy, planning, and
            intent to every brand element. Showcased as greatness that's aligned
            with user needs. This isn't an aspiration; it's a transformation.
          </p>
        </div>
      </section>

      <section className="related-articles">
        <h2>
          More related
          <br />
          articles
        </h2>

        <div className="cards-container">
          <div className="cardss">
            {}
            <img src={getImageUrl("/images/Rectangle 63 (17).png")} alt="" />
            <div className="cardss-body">
              <span className="tag">Startups</span>
              <h3>Elements that capture and retain user interest</h3>
              <div className="meta">
                <span>📅 26/02/2025</span>
                <span>⏱ 7 mins</span>
              </div>
            </div>
          </div>

          <div className="cardss">
            {}
            <img src={getImageUrl("/images/Rectangle 63 (24).png")} alt="" />
            <div className="cardss-body">
              <span className="tag">Marketing</span>
              <h3>Top trends to watch and implement in 2024</h3>
              <div className="meta">
                <span>📅 26/02/2025</span>
                <span>⏱ 10 mins</span>
              </div>
            </div>
          </div>

          <div className="cardss">
            {}
            <img src={getImageUrl("/images/Rectangle 63 (18).png")} alt="" />
            <div className="cardss-body">
              <span className="tag">Design</span>
              <h3>Engaging your audience in the digital age</h3>
              <div className="meta">
                <span>📅 26/02/2025</span>
                <span>⏱ 4 mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
