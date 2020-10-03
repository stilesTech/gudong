class BookShelfInfo {
  constructor(id, title, icon, serialNumber, serialName, category, latestSerialNumber,latestChapterName, time) {
    this.Id = id;
    this.Title = title;
    this.Icon = icon;
    this.SerialNumber = serialNumber;
    this.SerialName = serialName;
    this.Category = category;
    this.LatestSerialNumber = latestSerialNumber;
    this.LatestChapterName = latestChapterName;
    this.Time = time;
  }

}

export { BookShelfInfo };