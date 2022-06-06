let fs = require("fs"),
  express = require("express"),
  mustache = require("mustache"),
  glob = require("glob"),
  app = express();

Number.prototype.times = function (fn) {
  let a = [];
  for (let i = 0; i < Number(this); i++) a.push(fn(i));
  return a;
};

let file = (path) => fs.readFileSync(path, "utf8");

let renderHelpers = {
  textSource() {
    return `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Fusce et mauris eu arcu auctor imperdiet.
      Vivamus nec ex vitae libero ultrices vulputate eu non leo.
      In a mi a velit cursus mattis.
      Nam placerat enim quis ex euismod, quis dictum quam congue.
      Proin ut ante ut odio imperdiet semper ac non est.
      Morbi ac lectus dictum, vestibulum odio vitae, tempus risus.
      Fusce hendrerit felis sed nulla rhoncus fermentum.
      Duis dignissim sapien feugiat, cursus nulla non, vestibulum tellus.
      Ut commodo mauris quis dapibus venenatis.
      Duis iaculis mi quis massa dictum, sit amet placerat nisi ultrices.
      Sed mattis purus a est pharetra lacinia.
      Integer malesuada nisi in sodales viverra.
      Aliquam maximus risus ac ipsum sagittis aliquam.
      Duis consequat erat quis euismod fermentum.
      Suspendisse vitae augue id augue faucibus maximus.
      Vivamus nec erat rutrum, mollis ex nec, pretium mi.
      Vestibulum porta justo eu lorem eleifend laoreet.
      Cras maximus nisi et urna condimentum, a tincidunt dui fermentum.
      Maecenas at diam in ipsum convallis ultrices.
      Curabitur aliquam enim vitae neque rutrum, at rhoncus sem congue.
      Maecenas et ex ac lorem tempus accumsan et quis est.
      Nullam id ex porttitor, efficitur leo nec, maximus augue.
      Vivamus non sapien eu nisi commodo dignissim a at turpis.
      Vivamus a dolor eu odio tempor finibus id et massa.
      Donec finibus tellus sed dui gravida maximus.
      Donec malesuada ante vel sem dignissim viverra ac non nisi.
      Nunc euismod justo eget urna luctus dictum.
      Nulla sed erat tempor, lacinia massa ac, lacinia nisl.
      Praesent tempor tellus at velit egestas, et tincidunt lacus bibendum.
    `;
  },

  text() {
    let text = this.textSource();
    let a = Math.floor(Math.random() * text.length);
    let b = Math.floor(Math.random() * text.length);

    return "<p>" + text.substr(a, b) + "</p>";
  },

  numTable(rows, cols) {
    let s = "";
    rows.times(function (r) {
      s += "<tr>";
      cols.times(function (c) {
        s += `<td>${r + 1}.${c + 1}</td>`;
      });
      s += "</tr>";
    });
    return `<table>${s}</table>`;
  },
};

let renderTemplate = (tpl) => {
  let path;

  path = `${__dirname}/templates/${tpl}.html`;
  if (fs.existsSync(path)) {
    return mustache.render(file(path), {
      text: renderHelpers.text(),
    });
  }

  path = `${__dirname}/templates/${tpl}.js`;
  if (fs.existsSync(path)) {
    return require(path).render(renderHelpers);
  }

  return `${tpl}=404`;
};

let renderDoc = (content) =>
  mustache.render(file(`${__dirname}/base.html`), { content: content });

//

app.use(express.static(__dirname + "/public"));

app.get("/only/:tpl", (req, res, next) => {
  let content = req.params.tpl.split(",").map(renderTemplate).join("");
  res.send(renderDoc(content));
});

app.get("/base", (req, res, next) => {
  res.send(renderDoc(""));
});

app.get("/frame", (req, res, next) => {
  res.send(file(`${__dirname}/frame.html`));
});

app.get("/raw/:tpl", (req, res, next) => {
  let content = req.params.tpl.split(",").map(renderTemplate).join("");
  res.send(content);
});

app.get("/all", (req, res, next) => {
  let content = "",
    all =
      "simple spans numbers forms hidden framea nested scroll frameb styled frameset dynamic";

  all.split(" ").forEach((tpl) => {
    content += `<h2>${tpl}</h2>`;
    content += renderTemplate(tpl);
    content += renderHelpers.text();
  });

  res.send(renderDoc(content));
});

app.listen(9876);
