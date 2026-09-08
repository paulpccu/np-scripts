(function () {
  "use strict";

  const DEFAULT_CAMP = {
    name: "ORGANIZATION",
    shortName: "ORG NAME",
    category: "police",
    taxStatus: "PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER.",
    location: "PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER.",
    website: "PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER.",
    localAnswer: "PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER.",
    percentQuestionName: "THE ORGANIZATION"
  };

  function cleanVicidialValue(value) {
    const cleaned = String(value || "").trim();
    if (!cleaned || /^--A--.*--B--$/i.test(cleaned)) {
      return "";
    }
    return cleaned;
  }

  function getParam(params, names, fallback) {
    for (let index = 0; index < names.length; index += 1) {
      const value = cleanVicidialValue(params.get(names[index]));
      if (value) {
        return value;
      }
    }
    return fallback;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function groupWords(category) {
    if (category === "firefighters") {
      return {
        supporters: "these FIREFIGHTERS",
        donorGroup: "FIREFIGHTERS",
        local: "FIREFIGHTERS"
      };
    }
    if (category === "veterans") {
      return {
        supporters: "these VETERANS",
        donorGroup: "VETERANS",
        local: "VETERANS"
      };
    }
    return {
      supporters: "these OFFICERS",
      donorGroup: "OFFICERS",
      local: "OFFICERS"
    };
  }

  function renderDefaultQuestions(camp, words) {
    return [
      ["IF A QUESTION IS NOT ON HERE?", "PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER: 866-521-5776."],
      ["ARE YOU A MEMBER OF THE ORGANIZATION?", "NO, I WORK FOR GOOD MERITS INC, A PROFESSIONAL FUNDRAISING COMPANY WHICH HAS BEEN CONTRACTED BY " + camp.name + "."],
      ["WHAT IS THE TAX STATUS OF THIS ORGANIZATION?", camp.taxStatus],
      ["WHERE IS THE ORGANIZATION LOCATED?", camp.location],
      ["DO THEY HAVE A WEBSITE?", camp.website],
      ["HOW MUCH GOES TO " + camp.percentQuestionName + "?", "OUR INSTRUCTIONS ARE TO TELL EVERYONE A MINIMUM OF 12% GOES TO THE CAUSE, IF YOU WOULD LIKE MORE INFORMATION I CAN GIVE YOU A NUMBER TO CALL."],
      ["DOES THIS HELP OUT LOCALLY?", camp.localAnswer],
      ["WHO DO YOU WORK FOR?", "I WORK FOR GOOD MERITS INC HEADQUARTERED AT 8 THE GREEN SUITE 8514 DOVER DE 19901."]
    ].map(function (item) {
      return "<p><strong>QUESTION: " + item[0] + "</strong><br />RESPONSE: " + item[1] + "</p>";
    }).join("");
  }

  function renderDareQuestions() {
    return [
      ["IF A QUESTION IS NOT ON HERE?", "PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER: 866-521-5776."],
      ["WHO IS DARE:", "D.A.R.E was launched in 1983, as a drug prevention education program taught in thousands of schools in America. These programs are lead by police officers who are trained by DARE in educating our children about the dangers of drugs and violence."],
      ["ARE YOU A MEMBER OF THE ORGANIZATION?", "NO, I WORK FOR GOOD MERITS INC, A PROFESSIONAL FUNDRAISING COMPANY WHICH HAS BEEN CONTRACTED BY DARE."],
      ["WHAT IS THE TAX STATUS OF THIS ORGANIZATION?", "DARE IS A 501(C)(3) YOUR CONTRIBUTION MAY BE TAX DEDUCTIBLE, BUT WE SUGGEST YOU CONSULT YOUR TAX PREPARER."],
      ["WHERE IS THE ORGANIZATION LOCATED?", "THE ORGANIZATION IS HEADQUARTERED IN SANTA MONICA CALIFORNIA."],
      ["DO THEY HAVE A WEBSITE?", "WWW.DARE.ORG"],
      ["HOW MUCH GOES TO DARE?", "OUR INSTRUCTIONS ARE TO TELL EVERYONE A MINIMUM OF 12% GOES TO THE CAUSE, IF YOU WOULD LIKE MORE INFORMATION I CAN GIVE YOU A NUMBER TO CALL."],
      ["DOES THIS HELP OUT LOCALLY?", "THIS IS A NATIONAL PROGRAM."],
      ["WHO DO YOU WORK FOR?", "I WORK FOR GOOD MERITS INC HEADQUARTERED AT 8 THE GREEN SUITE 8514 DOVER DE 19901."]
    ].map(function (item) {
      return "<p><strong>QUESTION: " + item[0] + "</strong><br />RESPONSE: " + item[1] + "</p>";
    }).join("");
  }

  function isPoliticalScript(camp, qAndA) {
    const text = (camp.name + " " + (qAndA || "")).toUpperCase();
    return /\b527\b/.test(text) || /\bPAC\b/.test(text) || text.indexOf("POLITICAL COMMITTEE") !== -1 || text.indexOf("FEC COMPLIANCE") !== -1;
  }

  function renderPoliticalAsk(camp, words) {
    const group = words.donorGroup.toLowerCase();
    const campNameAfterThe = camp.name.replace(/^THE\s+/i, "");
    return [
      '<p>SIR/MA\'AM THE REASON FOR THE CALL IS THAT MY RECORDS SHOW YOU WERE GENEROUS ENOUGH TO MAKE A PLEDGE TO SUPPORT THE ORGANIZATION BACK IN <span class="highlight-yellow">(<span id="comments">--A--comments--B--</span>)</span>. DO YOU REMEMBER MAKING THAT PLEDGE?</p>',
      '<p><span class="highlight-cyan">IF YES</span></p>',
      '<p>GREAT NOW IS THAT <span class="highlight-yellow">$<span id="security_phrase_display">--A--security_phrase--B--</span></span> YOU PLEDGED BACK THEN STILL COMFORTABLE FOR YOU TODAY?</p>',
      '<p>IF YES - OK GREAT, WELL SINCE WE SPOKE TO YOU BACK IN <span class="highlight-yellow">(<span id="comments_repeat">--A--comments--B--</span>)</span> WE MAILED YOU TWO PLEDGE KITS WITH RECEIPTS, WHICH UNFORTUNATELY HAVE NOT BEEN RETURNED, BUT NOW THAT YOU HAVE THE RECEIPT CAN YOU HONOR THAT PLEDGE TO THE ' + group + ' WITH A CREDIT OR DEBIT CARD TODAY, ONE TIME FOR THE DRIVE?</p>',
      '<p><span class="highlight-green">IF NO</span></p>',
      '<p>OH REALLY? WELL IT DOES SHOW HERE WHEN WE SPOKE TO YOU BACK ON <span class="highlight-yellow">(<span id="comments_no">--A--comments--B--</span>)</span> YOU WERE GENEROUS ENOUGH TO PLEDGE <span class="highlight-yellow">$<span id="security_phrase_repeat">--A--security_phrase--B--</span></span> TO SUPPORT LEGISLATORS WHO WORK TO KEEP COMMUNITIES SAFE AS WELL AS SUPPORT ASSISTANCE TO THE FAMILIES OF ' + group + ' KILLED IN THE LINE OF DUTY.</p>',
      '<p>NOW IS THAT <span class="highlight-yellow">$<span id="security_phrase_repeat_two">--A--security_phrase--B--</span></span> YOU PLEDGED BACK THEN STILL COMFORTABLE FOR YOU TODAY?</p>',
      '<p>GREAT, AND YOUR NAME IS <b><span id="first_name_repeat">--A--first_name--B--</span> <span id="last_name_repeat">--A--last_name--B--</span></b></p>',
      '<p>IF YES - OK GREAT, WELL WE DID MAIL YOU TWO PLEDGE KITS WHICH UNFORTUNATELY HAVE NOT BEEN RETURNED, BUT NOW THAT YOU HAVE THE RECEIPT CAN YOU HONOR THAT PLEDGE TO THE ' + group + ' WITH A CREDIT OR DEBIT CARD TODAY, ONE TIME FOR THE DRIVE?</p>',
      '<p><b>UPSALES</b></p>',
      '<p>Great MR/MRS <b><span id="first_name_upsale">--A--first_name--B--</span> <span id="last_name_upsale">--A--last_name--B--</span></b> being that we are closing this out now and your help is so needed for this important cause and to offset the postage and printing costs of the mailings we sent you would you be able to reach up and help out with the BADGE OF HONOR pledge which is an additional $15?</p>',
      '<p>(If No to additional $15) OK no problem. How about the booster pledge which is only an extra $5.</p>',
      '<p><b>Thank you for your support for THE ' + campNameAfterThe + '.</b></p>',
      '<p>IF they still do not want to use card ask them to mail the donation in today they are counting on your promise of donation of <span class="highlight-yellow">$<span id="security_phrase_mail">--A--security_phrase--B--</span></span>. Thank You for your support</p>'
    ].join("");
  }

  function renderStandardAsk(pitch) {
    return [
      '<p>' + pitch + '</p>',
      '<p><b>IF DONOR ASK WHAT THEY PLEDGED</b><br />AMOUNT OF PLEDGE WAS <span class="highlight-yellow">$<span id="security_phrase_display">--A--security_phrase--B--</span></span></p>',
      '<p><span class="highlight-cyan">IF YES</span><br /><b>(FIRST ASK) GREAT, ARE YOU USING A DEBIT OR CREDIT CARD TODAY?</b><br /><span class="highlight-yellow">PLEASE HOLD ON I AM GOING TO TRANSFER YOU TO A SECURE LINE SO THEY CAN TAKE YOUR CARD INFORMATION.</span></p>'
    ].join("");
  }

  function renderScript(camp) {
    const words = groupWords(camp.category);
    const crownQAndA = window.NP_QNAS && window.NP_QNAS[camp.code];
    const qAndA = crownQAndA || (camp.code === "dare" ? renderDareQuestions() : renderDefaultQuestions(camp, words));
    const isPolitical = isPoliticalScript(camp, qAndA);
    const isInbound = window.NP_SCRIPT_MODE === "inbound";
    const titleSuffix = isInbound ? " INBOUND" : "";
    const greeting = isInbound
      ? 'HELLO THANKS FOR CALLING BACK IN <b><span id="first_name">--A--first_name--B--</span> <span id="last_name">--A--last_name--B--</span></b> THIS IS (CALLERS FULL NAME) CALLING FOR <b><span class="highlight-yellow">' + camp.name + '.</span></b>'
      : 'Good Morning/Afternoon/Evening, <b><span id="first_name">--A--first_name--B--</span> <span id="last_name">--A--last_name--B--</span></b> (CALLERS FULL NAME) calling for <b>' + camp.name + '.</b>';
    const pitch = isInbound
      ? 'Sir/Mam as a paid caller for <b>GOOD MERITS</b> my records show we spoke to you on <span class="highlight-yellow">(last month)</span> when you pledged your support to ' + words.supporters + ' and were sent a receipt and return envelope. We are currently wrapping up our benefit drive and now that you have the receipt can you make your donation with a debit or credit card today?'
      : 'Sir/Mam as a paid caller for <b>GOOD MERITS</b> the reason for the ORIGINAL call is that my records show you we spoke to you on <span class="highlight-yellow">(last month)</span> when you pledged your support to ' + words.supporters + ' and were sent a receipt and return envelope. Now that you have the receipt can you make your donation with a debit or credit card today?';
    const mainAsk = isPolitical ? renderPoliticalAsk(camp, words) : renderStandardAsk(pitch);

    document.title = "NONPAID " + camp.name + titleSuffix;
    document.body.innerHTML =
      '<h1>NONPAID ' + camp.name + titleSuffix + '</h1>' +
      '<section id="SCRIPTS">' +
      '<p><span class="highlight-red bold">ASSUME NAME ON SCREEN ONLY PITCH NAME ON SCREEN</span></p>' +
      '<p>' + greeting + '</p>' +
      '<p>ON SCREEN ONLY PITCH NAME ON SCREEN</p>' +
      mainAsk +
      '</section>' +
      '<section id="NONPAID_REBUTTALS">' +
      '<h2>NONPAID REBUTTALS</h2>' +
      '<nav class="nav-links">' +
      '<a href="#IF_DID_NOT_RECEIVE_IT">IF DID NOT RECEIVE IT.</a>' +
      '<a href="#DOESNT_USE_CARD">DOES NOT USE CARD OVER PHONE / NOT COMFORTABLE USING CARD.</a>' +
      '<a href="#HAS_PLEDGE_WANTS_MAIL">HAS THE PLEDGE BUT WANTS TO MAIL IT.</a>' +
      '<a href="#LOST_PLEDGE_KIT">I LOST IT / WANTS ANOTHER PLEDGE KIT.</a>' +
      '<a href="#CANT_DO_AMOUNT">CAN NOT DO AMOUNT / CAN NOT AFFORD.</a>' +
      '<a href="#ALREADY_SENT_IT">I ALREADY SENT IT.</a>' +
      '<a href="#DOES_NOT_HAVE_CARDS">DOES NOT HAVE CARDS.</a>' +
      '<a href="#QA">TO Q&A</a>' +
      '</nav>' +
      '</section>' +
      '<section id="IF_DID_NOT_RECEIVE_IT"><h3>IF DID NOT RECEIVE IT</h3><p>YOU KNOW MY RECORDS SHOW WE ACTUALLY DID SEND AN ENVELOPE OVER TO <span id="address">--A--address1--B--</span>. THAT IS OK THOUGH WE UNDERSTAND THINGS COME UP OR GET LOST SOMETIMES. CAN YOU STILL HONOR YOUR COMMITMENT TO ' + words.supporters + ' WITH A SMALL GIFT OF JUST 55 35 OR 25 DOLLARS JUST THIS ONE TIME?</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="DOESNT_USE_CARD"><h3>DOES NOT USE CARD OVER PHONE / NOT COMFORTABLE USING CARD</h3><p>I COMPLETELY UNDERSTAND YOUR HESITATION (DONOR NAME) BUT YOUR IMMEDIATE SUPPORT WOULD GO A LONG WAY FOR ' + words.supporters + '. THAT IS WHY FOR YOUR SAFETY EVERYTHING IS DONE ON A SECURE LINE AND WE DO NOT TAKE THE SECURITY CODE ON THE BACK OF YOUR CARD SO IT CAN NEVER BE USED AGAIN. ALSO THE CHARGE WOULD SHOW UP AS ' + camp.name + ' SO YOU KNOW EXACTLY WHERE YOUR MONEY IS GOING, SO WOULD THAT BE OK FOR YOU JUST THIS ONE TIME?</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="HAS_PLEDGE_WANTS_MAIL"><h3>HAS THE PLEDGE BUT WANTS TO MAIL IT</h3><p>YOU KNOW (DONOR NAME) THAT IS ALWAYS AN OPTION. HOWEVER, THEY ARE TRYING TO CLOSE OUT THE DRIVE TODAY AND GET IMMEDIATE SUPPORT TO ' + words.supporters + '. MOST PEOPLE HAVE BEEN HONORING THEIR PLEDGE TODAY WITH A CARD. SO WOULD THAT BE OK FOR YOU JUST THIS ONE TIME?</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="LOST_PLEDGE_KIT"><h3>I LOST IT / WANTS ANOTHER PLEDGE KIT</h3><p>WELL, THEY ARE TRYING TO CLOSE OUT THE DRIVE TODAY SO THERE IS NOT ANYTHING ELSE I CAN SEND YOU NOW. SINCE THEY DID ALREADY MAIL AN ENVELOPE OVER TO <span id="address_repeat">--A--address1--B--</span> FOR YOU IS IT OK IF YOU COULD HONOR YOUR PLEDGE TODAY WITH A SMALL CONTRIBUTION OF JUST 55, 35 OR 25 DOLLARS JUST THIS ONE TIME?</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="CANT_DO_AMOUNT"><h3>CAN NOT DO AMOUNT / CAN NOT AFFORD</h3><p>WELL YOU KNOW IT IS THE THOUGHT NOT THE SIZE OF YOUR GIFT THAT COUNTS AND THE ORGANIZATION REALLY APPRECIATES YOUR SUPPORT. CAN YOU HONOR YOUR PLEDGE TODAY WITH ONE OF OUR SMALLER SPOTS OF JUST 55 35 OR 25 DOLLARS ONE TIME FOR THE DRIVE?</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="ALREADY_SENT_IT"><h3>I ALREADY SENT IT</h3><p>UNFORTUNATELY, MY RECORDS DO NOT SHOW THAT THE PLEDGE WAS EVER PAID FOR, SO IT IS POSSIBLE THAT WAS A SLIGHTLY DIFFERENT ORGANIZATION. CAN YOU STILL HONOR YOUR COMMITMENT TO ' + words.supporters + ' WITH A SMALL GIFT OF JUST 55 35 OR 25 DOLLARS JUST THIS ONE TIME?</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="DOES_NOT_HAVE_CARDS"><h3>DOES NOT HAVE CARDS</h3><p>DO YOU HAVE A DEBIT OR BANK CARD YOU CAN USE?<br /><b>IF NO</b> - OK NO PROBLEM, DO YOU STILL HAVE THE PLEDGE KIT FROM ' + camp.name + '?<br /><b>IF YES</b> - GREAT, CAN ' + camp.name + ' COUNT ON YOU TO SEND BACK YOUR DONATION RIGHT AWAY?<br />GREAT THANK YOU FOR YOUR SUPPORT!</p><a href="#NONPAID_REBUTTALS">BACK TO REBUTTALS</a></section>' +
      '<section id="QA" class="qa center"><h2>Q&A</h2><p>IF A QUESTION IS NOT ON HERE PLEASE REFER THE CONSUMER TO THE CORRESPONDING 800 NUMBER 866-528-9961</p><a href="#SCRIPTS">BACK TO SCRIPT</a>' + qAndA + '</section>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    const camp = Object.assign({}, DEFAULT_CAMP, window.NP_CAMP || {});
    const params = new URLSearchParams(window.location.search);

    renderScript(camp);

    setText("first_name", getParam(params, ["first_name"], "--A--first_name--B--"));
    setText("last_name", getParam(params, ["last_name"], "--A--last_name--B--"));
    setText("first_name_repeat", getParam(params, ["first_name"], "--A--first_name--B--"));
    setText("last_name_repeat", getParam(params, ["last_name"], "--A--last_name--B--"));
    setText("first_name_upsale", getParam(params, ["first_name"], "--A--first_name--B--"));
    setText("last_name_upsale", getParam(params, ["last_name"], "--A--last_name--B--"));
    setText("security_phrase_display", getParam(params, ["security_phrase"], "--A--security_phrase--B--"));
    setText("security_phrase_repeat", getParam(params, ["security_phrase"], "--A--security_phrase--B--"));
    setText("security_phrase_repeat_two", getParam(params, ["security_phrase"], "--A--security_phrase--B--"));
    setText("security_phrase_mail", getParam(params, ["security_phrase"], "--A--security_phrase--B--"));
    setText("comments", getParam(params, ["comments"], "--A--comments--B--"));
    setText("comments_repeat", getParam(params, ["comments"], "--A--comments--B--"));
    setText("comments_no", getParam(params, ["comments"], "--A--comments--B--"));
    setText("address", getParam(params, ["address1", "address"], "--A--address1--B--"));
    setText("address_repeat", getParam(params, ["address1", "address"], "--A--address1--B--"));
  });
}());
