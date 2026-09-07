(function () {
  "use strict";

  const MODE = window.NP_MASTER_SCRIPT_MODE === "inbound" ? "inbound" : "outbound";

  const CAMPS = [
    { name: "AMERICAN COALITION FOR POLICE AND SHERIFFS PAC", keys: ["acps", "american coalition for police and sheriffs", "coalition for police and sheriffs pac", "american coalition of police and sheriffs pac", "coalition of police and sheriffs pac"], route: "police/acps.html" },
    { name: "COMMITTEE FOR POLICE OFFICERS DEFENSE", keys: ["cpod", "committee for police officers defense"], route: "police/cpod.html" },
    { name: "DARE DRUG ABUSE RESISTANCE EDUCATION", keys: ["dare", "drug abuse resistance education"], route: "police/dare.html" },
    { name: "FLORIDA POLICE AND TROOPERS ASSOCIATION", keys: ["flpta", "florida police and troopers association"], route: "police/flpta.html" },
    { name: "LAW ENFORCEMENT AGAINST DRUGS", keys: ["lead", "law enforcement against drugs"], route: "police/lead.html" },
    { name: "MICHIGAN FRATERNAL ORDER OF POLICE FUND", keys: ["mifpac", "michigan fraternal order of police fund", "michigan fraternal order of police political fund"], route: "police/mifpac.html" },
    { name: "NATIONAL EMERGENCY RESPONDERS COALITION", keys: ["nerc", "national emergency responders coalition"], route: "police/nerc.html" },
    { name: "NATIONAL FALLEN OFFICER FOUNDATION", keys: ["nfof", "national fallen officer foundation", "national fallen officers foundation"], route: "police/nfof.html" },
    { name: "NEW JERSEY POLICE OFFICERS FOUNDATION", keys: ["njpof", "new jersey police officers foundation"], route: "police/njpof.html" },
    { name: "NATIONAL POLICE SUPPORT FUND", keys: ["npsf", "national police support fund"], route: "police/npsf.html" },
    { name: "POLICE ADVOCACY COMMITTEE PAC", keys: ["padvpav", "padv", "police advocacy committee"], route: "police/padvpav.html" },
    { name: "THE POLICE ASSOCIATION OF VIRGINIA", keys: ["pava", "police association of virginia"], route: "police/pava.html" },
    { name: "THE POLICE CONFERENCE OF NEW YORK", keys: ["pcny", "police conference of new york"], route: "police/pcny.html" },
    { name: "PENNSYLVANIA NARCOTICS OFFICERS ASSOCIATION", keys: ["pnoa", "pennsylvania narcotics officers association"], route: "police/pnoa.html" },
    { name: "POLICE OFFICERS ACTION COMMITTEE PAC", keys: ["poacom", "police officers action committee"], route: "police/poacom.html" },
    { name: "POLICE OFFICERS ALLIANCE PAC", keys: ["poac", "police officers alliance"], route: "police/poac.html" },
    { name: "POLICE OFFICERS SUPPORT ASSOCIATION PAC", keys: ["posa", "police officers support association", "police officers support association pac"], route: "police/posa.html" },
    { name: "POLICE OFFICERS SUPPORT COMMITTEE PAC", keys: ["posc", "police officers support committee", "police officer support committee pac"], route: "police/posc.html" },
    { name: "POLICE AND SHERIFFS SUPPORT ALLIANCE PAC", keys: ["pssa", "police and sheriffs support alliance"], route: "police/pssa.html" },
    { name: "POLICE AND TROOPERS RELIEF FOUNDATION", keys: ["ptrf", "police and troopers relief foundation"], route: "police/ptrf.html" },
    { name: "TEXAS COALITION OF POLICE AND SHERIFFS", keys: ["txcops", "txcop", "texas coalition of police and sheriffs"], route: "police/txcops.html" },
    { name: "TEXAS FALLEN OFFICER FOUNDATION", keys: ["txfof", "texas fallen officer foundation", "texas fallen officers foundation"], route: "police/txfof.html" },
    { name: "AMERICAN FIREFIGHTERS COALITION PAC", keys: ["afc", "american firefighters coalition", "american firefighters coaltion pac"], route: "firefighters/afc.html" },
    { name: "COALITION FOR PARAMEDICS AND FIREFIGHTERS PAC", keys: ["cfpff", "coalition for paramedics and firefighters"], route: "firefighters/cfpff.html" },
    { name: "COMMITTEE FOR PARAMEDICS AND FIREFIGHTERS PAC", keys: ["cpft", "committee for paramedics and firefighters"], route: "firefighters/cpft.html" },
    { name: "FIREFIGHTERS CHARITABLE FOUNDATION", keys: ["fcf", "firefighters charitable foundation"], route: "firefighters/fcf.html" },
    { name: "FIREFIGHTERS SUPPORT ALLIANCE", keys: ["ffsa", "firefighters support alliance"], route: "firefighters/ffsa.html" },
    { name: "NATIONAL COMMITTEE FOR VOLUNTEER FIREFIGHTERS PAC", keys: ["ncvf", "national committee for volunteer firefighters"], route: "firefighters/ncvf.html" },
    { name: "VOLUNTEER FIREFIGHTERS ALLIANCE", keys: ["vfa", "volunteer firefighters alliance"], route: "firefighters/vfa.html" },
    { name: "VOLUNTEER FIREFIGHTERS SUPPORT COMMITTEE PAC", keys: ["voffsc", "volunteer firefighters support committee"], route: "firefighters/voffsc.html" },
    { name: "AMERICAN VETERANS SUPPORT COMMITTEE PAC", keys: ["avsc", "american veterans support committee"], route: "veterans/avsc.html" },
    { name: "COALITION FOR HOMELESS AND DISABLED VETERANS PAC", keys: ["chdvpac", "chdv", "coalition for homeless and disabled veterans"], route: "veterans/chdvpac.html" },
    { name: "HANDICAPPED VETERANS SERVICE INITIATIVE PAC", keys: ["hscdipac", "hscdi", "hscid", "handicapped veterans service initiative"], route: "veterans/hscdipac.html" },
    { name: "NATIONAL COALITION FOR DISABLED VETERANS PAC", keys: ["ncdv", "national coalition for disabled veterans"], route: "veterans/ncdv.html" },
    { name: "AMERICAN VETERANS DEPARTMENT OF NEW YORK", keys: ["nyamvets", "ny amvets", "new york amvets", "american veterans department of new york"], route: "veterans/nyamvets.html" },
    { name: "THE UNITED VETERANS OF AMERICA PAC", keys: ["unvet", "united veterans of america"], route: "veterans/unvet.html" },
    { name: "VETERANS ASSOCIATION OF AMERICA", keys: ["vaa", "veterans association of america"], route: "veterans/vaa.html" },
    { name: "VETERANS ASSISTANCE ACTION FUND PAC", keys: ["vaf", "veterans assistance action fund"], route: "veterans/vaf.html" }
  ];

  function normalize(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/&/g, "AND")
      .replace(/[^A-Z0-9]+/g, "");
  }

  function routeText(params) {
    return [
      params.get("list_description"),
      params.get("list_name"),
      params.get("list_id"),
      params.get("campaign"),
      params.get("group"),
      params.get("vendor_lead_code"),
      window.location.search
    ].filter(Boolean).join(" ");
  }

  function scoreCamp(camp, normalizedText) {
    return camp.keys.reduce(function (bestScore, key) {
      const normalizedKey = normalize(key);
      if (normalizedText === normalizedKey) {
        return Math.max(bestScore, normalizedKey.length + 1000);
      }
      if (normalizedText.indexOf(normalizedKey) !== -1) {
        return Math.max(bestScore, normalizedKey.length);
      }
      return bestScore;
    }, 0);
  }

  function pickCamp(text) {
    const normalizedText = normalize(text);
    const result = CAMPS
      .map(function (camp) {
        return { camp: camp, score: scoreCamp(camp, normalizedText) };
      })
      .filter(function (result) {
        return result.score > 0;
      })
      .sort(function (left, right) {
        return right.score - left.score;
      })[0];

    return result ? result.camp : null;
  }

  function showError(message, details) {
    const status = document.getElementById("router-status");
    if (status) {
      status.textContent = message;
    }

    const detailBox = document.createElement("pre");
    detailBox.textContent = details.join("\n");
    document.body.appendChild(detailBox);
  }

  function inboundRoute(route) {
    return route.replace(/\.html$/i, "inbound.html");
  }

  function redirectToScript(route) {
    const targetUrl = new URL(route, window.location.href);
    targetUrl.search = window.location.search;
    window.location.replace(targetUrl.toString());
  }

  function run() {
    const params = new URLSearchParams(window.location.search);
    const campText = routeText(params);
    const camp = pickCamp(campText);

    if (!camp) {
      showError("Could not detect the correct NP script.", [
        "List Description: " + (params.get("list_description") || "[missing]"),
        "List Name: " + (params.get("list_name") || "[missing]"),
        "Campaign: " + (params.get("campaign") || "[missing]"),
        "Group: " + (params.get("group") || "[missing]")
      ]);
      return;
    }

    const status = document.getElementById("router-status");
    if (status) {
      status.textContent = "Loading " + camp.name + " NP " + MODE + " script.";
    }

    redirectToScript(MODE === "inbound" ? inboundRoute(camp.route) : camp.route);
  }

  run();
}());
