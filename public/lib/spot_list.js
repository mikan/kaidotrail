/** スポット一覧の構築と状態保持を行います。 */
class SpotList {
  /** @type {boolean} DOM 構築済の場合は true */
  #initialized = false;
  /** @type {Array} スポット一覧 */
  #spots; // Array
  /** @type {Map} アイコン定義のマップ */
  #iconMap; // Map

  /**
   * スポット一覧ページを利用できるようにします。DOM の構築は初めて表示するときまで遅延されます。
   * @param {Array} spots  スポット一覧
   * @param {Map} iconMap アイコン定義のマップ
   */
  constructor(spots, iconMap) {
    this.#spots = spots;
    this.#iconMap = iconMap;
    const buttonOpenSpotList = document.getElementById("spot-list-open");
    buttonOpenSpotList.addEventListener("click", this.#toggleSpotList.bind(this));
  }

  /**
   * 初期表示ページをパラメーターから判別し、必要ならスポット一覧に切り替えます。
   * @param {boolean} isBot ボットからのアクセスの場合は true
   */
  detectLandingPage(isBot = false) {
    const q = new URLSearchParams(location.search);
    if (q.get("landing") === "spots" || isBot) {
      this.#toggleSpotList();
    }
  }

  /** スポット一覧を表示します。すでに表示している場合は地図表示に戻ります。*/
  #toggleSpotList() {
    if (!this.#initialized) {
      this.#buildSpotList();
      this.#initialized = true;
    }
    const mapElm = document.getElementById("map");
    const spotList = document.getElementById("spot-list");
    if (spotList.style.display === "block") {
      spotList.style.display = "none";
      if (mapElm.style.display === "none") {
        mapElm.style.display = "block";
      }
    } else {
      const nonMapScreens = document.getElementsByClassName("non-map-screen");
      for (const nonMapScreen of nonMapScreens) {
        nonMapScreen.style.display = nonMapScreen.id === "spot-list" ? "block" : "none";
      }
      mapElm.style.display = "none";
    }
    if (spotList.style.display === "block") {
      const zoomInMessage = document.getElementById("zoom-in-message");
      if (zoomInMessage) {
        zoomInMessage.style.display = "none";
      }
    }
  }

  /**
   * 種別のタイトルにジャンプするアイコンを構築します。
   * @param {string} id id属性のサフィックス
   * @returns {HTMLAnchorElement} aタグ
   */
  #createJumpIcon(id) {
    const iconType = this.#iconMap.get(id);
    const jumpIcon = document.createElement("a");
    jumpIcon.href = `#spot-link-${id}`;
    jumpIcon.innerHTML = `<i class="fa-solid ${iconType.icon}" style="color: ${iconType.color}"></i>`;
    return jumpIcon;
  }

  /**
   * 表を生成します。
   * @param {Array} subSpots 処理対象のスポット一覧
   * @param {string} name 名前
   * @param {HTMLDivElement} parent 追加対象の要素
   * @param {string} id ジャンプ先に設定するid属性
   */
  #buildTable(subSpots, name, parent, id = "default") {
    const title = document.createElement("h2");
    title.innerText = name;
    title.id = `spot-link-${id}`;
    parent.appendChild(title);
    const table = document.createElement("table");
    subSpots.forEach((spot) => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.style.width = "200px";
      const iconType = this.#iconMap.get(spot.icon);
      td1.innerHTML = `<i class="fa-solid ${iconType.icon}" style="color: ${iconType.color}"></i> `;
      td1.innerHTML += `<a href="?lat=${spot.coordinate[0]}&lng=${spot.coordinate[1]}&z=17">${spot.name}</a><br/>`;
      if (spot.kana) {
        td1.innerHTML += `${spot.kana}<br/>`;
      }
      if (spot.pictures) {
        const pic = spot.pictures[0];
        td1.innerHTML += `<img src="${pic.url}" alt="${pic.comment}" width="200px"/><br/>`;
        if (spot.pictures.length > 1) {
          td1.innerHTML += `<div class="other-pics">(他${spot.pictures.length - 1}枚)</div>`;
        }
      }
      tr.appendChild(td1);
      const td2 = document.createElement("td");
      td2.innerHTML = spot.description ?? "(未記入)";
      tr.appendChild(td2);
      table.appendChild(tr);
    });
    parent.appendChild(table);
  }

  /**
   * マップに戻るボタンを生成します。
   * @param {number} mt margin-top
   * @param {number} mb margin-bottom
   * @returns {HTMLButtonElement} マップに戻るボタン
   */
  #createBackToMapButton(mt = 0, mb = 0) {
    const backToMap = document.createElement("button");
    backToMap.innerHTML = "<i class='fa-solid fa-circle-arrow-left'></i> 地図に戻る";
    backToMap.style.marginTop = `${mt}px`;
    backToMap.style.marginBottom = `${mb}px`;
    backToMap.addEventListener("click", this.#toggleSpotList.bind(this));
    return backToMap;
  }

  /**
   * トップに戻るボタンを生成します。
   * @param {number} ml margin-left
   * @returns {HTMLButtonElement} トップに戻るボタン
   */
  #createBackToTopButton(ml = 5) {
    const backToTop = document.createElement("button");
    backToTop.innerHTML = "<i class='fa-solid fa-circle-arrow-up'></i> 先頭に戻る";
    backToTop.style.marginLeft = `${ml}px`;
    backToTop.addEventListener("click", () => window.scrollTo(0, 0));
    return backToTop;
  }

  /** スポット一覧の DOM を構築します。 */
  #buildSpotList() {
    const spotList = document.getElementById("spot-list");
    const btm1 = this.#createBackToMapButton(0, 10);
    spotList.appendChild(btm1);
    const iconPane = document.createElement("div");
    iconPane.className = "spot-link-icons";
    const passList = [],
      honjinList = [],
      ichirizukaList = [],
      sekishoList = [],
      watashiList = [],
      bridgeList = [],
      kosatsubaList = [],
      shrineList = [],
      templeList = [],
      monumentList = [],
      buildingList = [],
      otherList = [];
    this.#spots.forEach((spot) => {
      switch (spot.icon) {
        case "pass":
          passList.push(spot);
          break;
        case "honjin":
          honjinList.push(spot);
          break;
        case "ichirizuka":
          ichirizukaList.push(spot);
          break;
        case "sekisho":
          sekishoList.push(spot);
          break;
        case "watashi":
          watashiList.push(spot);
          break;
        case "bridge":
          bridgeList.push(spot);
          break;
        case "kosatsuba":
          kosatsubaList.push(spot);
          break;
        case "shrine":
          shrineList.push(spot);
          break;
        case "temple":
          templeList.push(spot);
          break;
        case "monument":
          monumentList.push(spot);
          break;
        case "building":
          buildingList.push(spot);
          break;
        default:
          otherList.push(spot);
          break;
      }
    });
    spotList.appendChild(iconPane);
    const buildIconSection = (id, name, subSpots) => {
      if (subSpots.length === 0) {
        return;
      }
      iconPane.appendChild(this.#createJumpIcon(id));
      this.#buildTable(subSpots, name, spotList, id);
      const btm = this.#createBackToMapButton(10, 0);
      spotList.appendChild(btm);
      const btt = this.#createBackToTopButton();
      spotList.appendChild(btt);
    };
    buildIconSection("pass", "峠", passList);
    buildIconSection("honjin", "本陣", honjinList);
    buildIconSection("ichirizuka", "一里塚", ichirizukaList);
    buildIconSection("sekisho", "関所", sekishoList);
    buildIconSection("watashi", "渡場", watashiList);
    buildIconSection("bridge", "橋", bridgeList);
    buildIconSection("kosatsuba", "高札場", kosatsubaList);
    buildIconSection("shrine", "神社", shrineList);
    buildIconSection("temple", "寺", templeList);
    buildIconSection("monument", "道標・記念碑・石仏・石塔・常夜燈等", monumentList);
    buildIconSection("building", "現存建造物", buildingList);
    buildIconSection("default", "その他", otherList);
    const picCount = this.#spots
      .map((spot) => (spot.pictures ? spot.pictures.length : 0))
      .reduce((acc, v) => acc + v, 0);
    const counter = document.createElement("p");
    counter.innerHTML = `全 ${this.#spots.length} 地点 (写真 ${picCount} 枚)`;
    spotList.appendChild(counter);
  }
}
