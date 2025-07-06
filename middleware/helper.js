function getPriceForShow(showtime) {
    const day = showtime.date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hour = parseInt(showtime.time.split(":")[0]);
  
    let dayType = "";
    if (day === 2 || day === 3) dayType = "deal";        // Tue, Wed
    else if (day === 1 || day === 4) dayType = "weekday"; // Mon, Thu
    else dayType = "weekend";                            // Fri, Sat, Sun
  
    let showType = "";
    if (hour >= 10 && hour < 13) showType = "morning";
    else showType = (dayType === "deal" ? "all" : "regular");
  
    const key = `${dayType}_${showType}`;
    let basePrice = showtime.priceRules.get(key);
  
    if (showtime.format === "3D") {
      basePrice += showtime.extra3DCharge;
    }
  
    return basePrice;
  }
  