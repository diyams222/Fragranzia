import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import "./About.css";

import aboutTop from "../../assets/spray.png";
import aboutBottom from "../../assets/spray2.png";
function About() {
  return (
    <>
      <Navbar />

      <div className="about-container">

        <div className="about-header">
          <h1>About Fragranzia</h1>
          <p>Home &gt; About</p>
        </div>

        <div className="about-content">

          <div className="about-text">

            <p>
              At Fragranzia, we believe that a perfume is more than just a
              scent—it's a story, an art, and a science combined to create
              memories that linger. Our journey began with a vision to craft
              exquisite fragrances that capture the essence of individuality
              and elevate every moment into something timeless.
            </p>

            <p>
              Guided by passion and precision, we source the finest ingredients
              from around the world to create perfumes that resonate with
              authenticity and luxury. Each bottle is a masterpiece,
              meticulously crafted to deliver an unparalleled sensory
              experience.
            </p>

            <p>
              Our commitment goes beyond creating fragrances. We aim to inspire
              confidence, evoke emotions, and celebrate uniqueness through
              every drop we produce. Fragranzia isn't just a brand—it's a
              celebration of you, your style, and your moments.
            </p>

            <p>
              With a legacy built on quality, artistry, and innovation, we
              invite you to explore our collection and find a scent that speaks
              your story.
            </p>

          </div>

          <div className="about-images">

            <img src={aboutTop} alt="Perfume" className="about-img top" />

            <img src={aboutBottom} alt="Perfume" className="about-img bottom" />

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default About;