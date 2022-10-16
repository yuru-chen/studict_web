function clean(a) {
    a = document.querySelector(a)
    while(a.firstChild){
        a.removeChild(a.firstChild)
    } 
    return a
}

function switchMode(className, changeMode){
    document.querySelectorAll(className).forEach((textplace)=>{
        textplace.style.display = changeMode
    })
}

function tagArticle(taggedArticle, article, beforeTag, tagged){
    let arti = article.toLowerCase();
    article = article.split(/\s*((?<= \. |\.|, |,| |:|"|\(|\)|\?|\n|-|“|'|’|‘)|(?= \. |\.|, |,|-| |:|"|\(|\)|\?|\n|“|'|’|‘))\s*/);
    arti = arti.split(/\s*((?<= \. |\.|, |,| |:|"|\(|\)|\?|\n|-|“|'|’|‘)|(?= \. |\.|, |,| |:|"|-|\(|\)|\?|\n|“|'|’|‘))\s*/);
    for(let i=0; i < article.length; i++){
        if (arti[i] == beforeTag[0]){
            //tagged word in article
            let temp = document.createElement("span");
            temp.className = "taggedArticle level"+tagged[0].level;
            temp.id = tagged[0].voc;
            let tt = document.createTextNode(article[i]);
            temp.appendChild(tt);
            temp.appendChild(document.createTextNode(' ')) //add space to make span tag can auto make new line
            taggedArticle.appendChild(temp);
            beforeTag.shift();
            tagged.shift();
        }else{
            let temp = document.createElement("span");
            temp.className = "notTaggedArticle";
            tt = document.createTextNode(article[i]);
            temp.appendChild(tt);
            temp.appendChild(document.createTextNode(' '));
            taggedArticle.appendChild(temp);
        }
    }
}

function tagWord(taggedWord, vocset){
    for(let i=0; i < vocset.length; i++){
            //tagged word and the translation
            let tb = document.createElement("div");
            tb.className = "taggedWord row";
            tb.id = vocset[i].voc;

            let r = document.createElement("div");
            r.className = "col-md-auto"
            let r1 = document.createElement("p");
            r1.className = "voc"
            let tt = document.createTextNode(vocset[i].voc);
            r1.appendChild(tt);
            r.appendChild(r1);

            let trans = vocset[i].translation;
            trans = trans.split("\n");
            console.log(trans)
            for(let t=0; t<trans.length; t++){
                let tr2 = document.createElement("p");
                tr2.className = "translation";
                let tt2 = document.createTextNode(trans[t]);
                tr2.appendChild(tt2);
                r.appendChild(tr2);
            }
            tb.appendChild(r);

            let th2 = document.createElement("div")
            th2.className = "col col-lg-2"
            let tr3 = document.createElement("button");
            tr3.className = "more btn btn-outline-secondary btn-sm";
            tr3.id = vocset.voc;
            let tt3 = document.createTextNode("more");
            tr3.appendChild(tt3)
            th2.appendChild(tr3);

            tb.appendChild(th2);
            

            tb.style.display = 'none';

            taggedWord.appendChild(tb);
          
    } 
}

function onReady(div, callback){
    let intervelID = window.setInterval(function(){
        if (document.querySelector(div).firstChild !== undefined){
            window.clearInterval(intervelID);
            callback.call(this);
        }
    },1000);
}

document.addEventListener("click", function (e) {
    //article
    //edit-mode to view mode
    if(e.target.classList.contains("submit")){
        let articles = document.querySelector('.form-control').value

        switchMode(".show-edit","none")
        switchMode("#loading","block")
        

        let taggedArticle = clean(".taggedArticlePlace")
        let taggedWord = clean(".taggedWord")

        if(articles){
            axios.post('/article',{
                article: articles
            }).then((res)=>{
                onReady(".taggedWord", function(){
                    switchMode("#loading","none")
                    switchMode(".show-view","block")
                })

                let article = res.data.articles;
                let beforeTag = res.data.beforeTag;
                let tagged = res.data.tagged;
                tagArticle(taggedArticle,article, beforeTag, tagged)

                let vocset = res.data.vocset;
                tagWord(taggedWord, vocset)  
            })
            .then(()=>{
                ar = document.querySelectorAll('span[class^="taggedArticle"]');
                ar.forEach(ar=>{
                    ar.addEventListener("click", function(e){
                        let id = this.getAttribute('id');
                        let voc = document.querySelectorAll('div[id='+id+']');
                        if(voc[0].style.display == 'none'){
                            voc[0].style.display = 'block'
                        }else{
                            voc[0].style.display = 'none'
                        }
                        
                     })

                })
            })
        }
    }

    //view mode to edit mode
    if(e.target.classList.contains("edit")){        
        switchMode(".show-edit","block")
        switchMode(".show-view","none")
    }

    //search
    if(e.target.classList.contains("input-group-text")||e.target.classList.contains("bi")){
        let voc = document.querySelector('.form-control').value;
        // console.log(voc)
        let vocset = clean('.result');
        let regexp = /[a-z]|[A-Z]/;
        if(regexp.test(voc)){
            switchMode("#loading","block")
            axios.post('/search',{
                voc:voc
            }).then((res)=>{
                onReady('.result', function(){
                    switchMode("#loading","none")
                })
                console.log(res)
                let stardict = res.data.stardict;
                let web = res.data.web;
                
                // voc spell web star
                let vocabulary = document.createElement('div');
                vocabulary.className = 'voc row';
                let tt = document.createTextNode(stardict[0].word);
                vocabulary.appendChild(tt);
                vocset.appendChild(vocabulary);

                let row1 = document.createElement('div');
                row1.className = 'voc row'
                let spell = document.createElement('span');
                spell.className = 'spell';
                let tt1 = document.createTextNode(web[0].hw);
                spell.appendChild(tt);
                row1.appendChild(spell);
                let col = document.createElement('span');
                col.className = 'colForSound'
                let img = document.createElement('img');
                img.className = 'sound';
                img.src = 'img/sound.png';
                img.width = '20';
                img.height = '20';
                img.id = web[0].url;
                col.appendChild(img)
                row1.appendChild(col);
                vocset.appendChild(row1);

                for(let i=1; i<web.length; i++){
                    let fl = document.createElement('div');
                    fl.className = 'fl row';
                    let tt2_1 = document.createTextNode(web[i].fl);
                    fl.appendChild(tt2_1);
                    vocset.appendChild(fl);

                    for(let j=0; j<web[i].def.length; j++){
                        let def = document.createElement('div');
                        def.className = 'def row';
                        let num = j+1
                        let tt2_2 = document.createTextNode(num.toString()+'.  '+web[i].def[j]);
                        def.appendChild(tt2_2);
                        vocset.appendChild(def);
                    };

                    let stem = document.createElement('div');
                    stem.className = 'stems row';
                    let tt2_3 = "延伸字：";
                    for(let j=0; j<web[i].stem.length; j++){
                        tt2_3 = tt2_3+web[i].stem[j]+', '
                    }
                    tt2_3 = document.createTextNode(tt2_3);
                    stem.appendChild(tt2_3)
                    vocset.appendChild(stem);
                }

                let trans = stardict[0].translation;
                trans = trans.split("\n");
                for(let t=0; t<trans.length; t++){
                    let translation = document.createElement("div");
                    translation.className = "translation row";
                    let tt3 = document.createTextNode(trans[t]);
                    translation.appendChild(tt3);
                    vocset.appendChild(translation);
                }
            }).then(()=>{
                let sound = document.querySelector('.sound');
                sound.addEventListener('click', function(e){
                    let url = this.getAttribute('id');
                    console.log(url)
                    new Audio(url).play();
                })
            }).catch(()=>{
                let err = document.createTextNode("找不到字耶");
                vocset.appendChild(err)
            })
        }else{
            console.log('haha');
            let err1 = document.createElement("div");
            let tt = document.createTextNode("我們只能搜尋英文字的呦")
            err1.appendChild(tt);
            vocset.appendChild(err1);
        };
    }
})
