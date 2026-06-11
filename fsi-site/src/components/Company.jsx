
export default function Company() {
  return (
    <section id="company" className="section">
    {/* // <section className="company"> */}
      {/* <div className="company-container"> */}
        {/* <h2 className="company-title">企業情報</h2> */}
        <h2>企業情報</h2>

        <div className="company-box">
          {/* <div className="company-info"> */}
            <dl>
              <dt>会社名</dt>
              <dd>FSI-STYLE CORP</dd>

              <dt>所在地</dt>
              <dd>
                〒000-0000<br />
                東京都〇〇区〇〇1-2-3<br />
                〇〇ビル 5F
              </dd>

              <dt>電話番号</dt>
              <dd>03-0000-0000</dd>
            </dl>
          {/* </div> */}

          <div className="company-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4039.2257955987498!2d135.49834645386537!3d34.736297230450084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e43971e2fe6d%3A0x9fb22d9f09b7e8f5!2z44CSNTMyLTAwMTEg5aSn6Ziq5bqc5aSn6Ziq5biC5reA5bed5Yy66KW_5Lit5bO277yV5LiB55uu77yR77yW!5e0!3m2!1sja!2sjp!4v1777276104956!5m2!1sja!2sjp"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      {/* </div> */}
    </section>
  );
}