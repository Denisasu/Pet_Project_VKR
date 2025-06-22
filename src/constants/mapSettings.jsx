// Центр карты (Барнаул) и zoom по умолчанию
export const MAP_CENTER = [53.34881098009905, 83.77624821208886];
export const MAP_ZOOM = 12;

// Цвета меток по категориям
export const CATEGORY_COLORS = {
  cardboard: "#FFA500",// Картон
  paper: "#05fadd", // Бумага
  plastic: "#1E90FF",
  glass: "#32CD32",
  metal: "#A9A9A9",
  batteries: "#FF4500",
  electronics: "#9370DB"
};

// Названия категорий
export const getCategoryName = (category) => {
  const names = {
    cardboard: "Картон",
    paper: "Бумага",
    plastic: "Пластик",
    glass: "Стекло",
    metal: "Металл",
    batteries: "Батарейки",
    electronics: "Электроника"
  };
  return names[category] || category;
};