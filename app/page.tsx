import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import OccasionChips from "@/components/OccasionChips";
import PresetButton from "@/components/PresetButton";
import Rotator from "@/components/Rotator";
import Wizard from "@/components/Wizard";
import { LEGAL, PARTNER } from "@/lib/legal";

// Отзывы и реакции временно взяты для старта, заменим на свои.
const REELS = [
  { n: "01", who: "Маша", tag: "День рождения" },
  { n: "02", who: "katena_93", tag: "Годовщина" },
  { n: "03", who: "Sokolova_L", tag: "Свадьба" },
  { n: "04", who: "lovebird_92", tag: "Признание в любви" },
  { n: "05", who: "Alino4ka_Msk", tag: "Юбилей" },
  { n: "06", who: "Анастасия", tag: "Благодарность" },
  { n: "07", who: "Олег", tag: "Благодарность" },
  { n: "08", who: "irissska_96", tag: "Романтичный подарок" },
];

const FAQ = [
  ["Это правда бесплатно?", "Да. Создать песню, послушать её и отправить ссылку — бесплатно и без регистрации. Платите, только если захотите скачать MP3: 290 ₽ за стандартное качество или 590 ₽ за супер-качество."],
  ["Сколько времени занимает?", "Пара минут на анкету, 10–20 секунд на текст и 1–3 минуты на запись песни. Можно успеть даже в день праздника."],
  ["Как подарить песню?", "После генерации у песни появляется своя страница с плеером и текстом. Отправьте ссылку в Telegram, WhatsApp или по почте — получатель откроет её без регистрации."],
  ["Можно поправить текст?", "Конечно. Текст пишет нейросеть по вашей истории, а перед записью вы можете исправить любую строчку или переписать его целиком."],
  ["Какие жанры и голоса есть?", "12 жанров — от поп и баллады до рэпа, шансона и диско 80-х. Голос женский или мужской, язык — русский или английский."],
  ["А если песня не понравится?", "Просто создайте новую или закройте страницу — вы ничего не платите. Подписок и скрытых платежей нет."],
  ["Что вы делаете с моей историей?", "Используем только для вашей песни. Не публикуем и не передаём третьим лицам. Получатель по ссылке видит песню и текст, но не вашу анкету."],
];

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <span className="eyebrow"><i />Песня-подарок за 2 минуты</span>
              <h1>Песня, где каждая строчка —<br /><Rotator /></h1>
              <p className="lead">
                Расскажите пару историй о человеке — и получите <b>настоящую песню</b> с его именем, вашими шутками и общими воспоминаниями.
                Слушать и делиться — бесплатно. <b>Платите, только если понравилось.</b>
              </p>
              <div className="proof">
                <div className="avatars">
                  {[1, 2, 3, 4, 5].map((i) => <img key={i} src={`/reviews/ava-${i}.png`} alt="" width={38} height={38} />)}
                </div>
                <div>
                  <b><span className="stars-rate">★★★★★</span> 1 800+ песен</b>
                  уже подарили близким
                </div>
              </div>
              <ul className="hero-perks">
                <li><Check />Без регистрации</li>
                <li><Check />Ссылка-подарок с плеером</li>
                <li><Check />12 жанров</li>
              </ul>
            </div>
            <Wizard />
          </div>
        </section>

        <div className="perks-strip">
          <div className="wrap">
            <div className="perk"><div className="perk-ico">🎧</div><div><b>Слушайте бесплатно</b><span>Оплата — только за скачивание</span></div></div>
            <div className="perk"><div className="perk-ico">🔗</div><div><b>Страница-подарок</b><span>Обложка, плеер и текст по ссылке</span></div></div>
            <div className="perk"><div className="perk-ico">⚡</div><div><b>Готово за минуты</b><span>Успеете даже в день праздника</span></div></div>
          </div>
        </div>

        <section id="how">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Как это работает</div>
              <h2>Хит про близкого<br />за 3 шага</h2>
            </div>
            <div className="steps">
              <div className="step"><div className="step-ico">💌</div><span className="step-n">1</span><h3>Расскажите о человеке</h3><p>Имя, повод и пара тёплых деталей: как познакомились, что любит, какое словечко вечно повторяет.</p></div>
              <div className="step"><div className="step-ico">🎚️</div><span className="step-n">2</span><h3>Выберите звучание</h3><p>Жанр, настроение и голос — от нежной акустики до бодрого рэпа. Текст можно поправить.</p></div>
              <div className="step"><div className="step-ico">🎁</div><span className="step-n">3</span><h3>Подарите по ссылке</h3><p>Песня готова за пару минут. Отправьте ссылку — и ждите реакцию.</p></div>
            </div>
          </div>
        </section>

        <section id="reviews">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Настоящие реакции</div>
              <h2>Когда слышишь своё имя в песне</h2>
              <p>Смотрите, как люди реагируют на песни, написанные только для них.</p>
            </div>
            <div className="reels">
              {REELS.map((r) => (
                <figure className="reel" key={r.n} style={{ margin: 0 }}>
                  <img className="cover" src={`/reviews/reel-${r.n}.jpg`} alt={`Реакция: ${r.tag}`} loading="lazy" />
                  <figcaption className="reel-top"><img src={`/reviews/story-${r.n}.png`} alt="" />{r.who}</figcaption>
                  <span className="reel-tag">{r.tag}</span>
                  <span className="reel-play" aria-hidden><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg></span>
                </figure>
              ))}
            </div>
            <div className="quote">
              <img src="/reviews/ava-3.png" alt="" />
              <div>
                <blockquote>«Мама услышала своё имя в песне и расплакалась. Весь вечер ставила её гостям заново»</blockquote>
                <cite>Алексей · день рождения мамы</cite>
              </div>
            </div>
          </div>
        </section>

        <section id="prices">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Цены</div>
              <h2>Платите, только если зацепило</h2>
              <p>Никаких подписок. Песня в студии стоит несколько тысяч и делается днями — здесь пара минут.</p>
            </div>
            <div className="prices">
              <div className="pcard">
                <h3>Послушать</h3>
                <div className="amount">0 ₽</div>
                <p className="muted">Всегда бесплатно</p>
                <ul><li>Текст по вашей истории</li><li>Две версии песни</li><li>Страница-подарок и ссылка</li></ul>
                <Link href="#create" className="btn btn-ghost">Создать песню</Link>
              </div>
              <div className="pcard">
                <h3>Стандарт</h3>
                <div className="amount">290 <small>₽</small></div>
                <p className="muted">За одну песню</p>
                <ul><li>Всё из бесплатного</li><li>Скачивание MP3</li><li>Звучание как на радио</li></ul>
                <Link href="#create" className="btn btn-ghost">Попробовать</Link>
              </div>
              <div className="pcard hot">
                <span className="badge">Хит</span>
                <h3>Супер-качество</h3>
                <div className="amount">590 <small>₽</small></div>
                <p className="muted">За одну песню</p>
                <ul><li>Новейшая модель Suno</li><li>Живее вокал и аранжировка</li><li>MP3 320 kbps</li></ul>
                <Link href="#create" className="btn btn-primary">Создать хит</Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Для каждого момента</div>
              <h2>Есть повод — будет песня</h2>
            </div>
            <OccasionChips />
          </div>
        </section>

        <section id="soon">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Скоро</div>
              <h2>Не только песни</h2>
            </div>
            <div className="soon-grid">
              <div className="soon-card poems"><span className="soon">скоро</span><span className="big-emoji" aria-hidden>📜</span><h3>Стихи</h3><p>Поздравление в стихах по вашей истории — для открытки, тоста или подписи к подарку.</p></div>
              <div className="soon-card chars"><span className="soon">скоро</span><span className="big-emoji" aria-hidden>🦸</span><h3>Персонажи</h3><p>Видео-поздравление от любимого героя: сказочного, мультяшного или киношного.</p></div>
            </div>
          </div>
        </section>

        <section id="newyear">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Новый год для детей</div>
              <h2>Пусть Дед Мороз споёт ребёнку по имени</h2>
              <p>Песня, в которой Дед Мороз или Снегурочка хвалят малыша за год и вспоминают его успехи. А если хочется настоящей сказки — приходите в мастерскую или зовите Деда Мороза домой.</p>
            </div>
            <div className="ny-grid">
              <div className="ny-card ny-song">
                <div className="ny-snow" aria-hidden />
                <span className="ny-emoji" aria-hidden>🎅</span>
                <h3>Песня от Деда Мороза</h3>
                <p>«Маша, я всё видел: ты научилась кататься на велосипеде и делилась конфетами с братом…» — расскажите о ребёнке, и Дед Мороз споёт о нём лично.</p>
                <div className="ny-actions">
                  <PresetButton className="btn btn-primary" preset={{ occasion: "newyear", recipient: "child", from: "ded_moroz", voice: "m", genre: "kids", mood: "fun" }}>🎅 От Деда Мороза</PresetButton>
                  <PresetButton className="btn btn-ghost" preset={{ occasion: "newyear", recipient: "child", from: "snegurochka", voice: "f", genre: "kids", mood: "fun" }}>❄️ От Снегурочки</PresetButton>
                </div>
                <span className="ny-note">Бесплатно · готово за пару минут</span>
              </div>
              <div className="ny-card ny-live">
                <span className="ny-emoji" aria-hidden>🍭</span>
                <h3>{PARTNER.title}</h3>
                <p>Встреча с Дедом Морозом, сказочный квест, мастер-класс по карамельным леденцам, театр теней и фотосессия — 1,5 часа волшебства в Санкт-Петербурге.</p>
                <div className="ny-actions">
                  <a href={PARTNER.url} target="_blank" rel="noopener" className="btn btn-primary">Записаться в мастерскую ↗</a>
                  <a href={`tel:${LEGAL.phone.replace(/[^+\d]/g, "")}`} className="btn btn-ghost">🏠 Деда Мороза домой</a>
                </div>
                <span className="ny-note">Звоните: {LEGAL.phone}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Коротко о главном</div>
              <h2>Частые вопросы</h2>
            </div>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="wrap">
            <h2>Самый личный подарок —<br />через пару минут</h2>
            <p className="lead">Начните прямо сейчас: это бесплатно и без регистрации.</p>
            <Link href="#create" className="btn btn-primary btn-lg">Создать песню бесплатно</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
