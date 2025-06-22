import { FullscreenControl, Map, Placemark } from "@pbe/react-yandex-maps";
import { useMemo } from "react";
import styled from "styled-components";
import { RECYCLING_POINTS } from "../../data/recyclingPoints";
import { MAP_CENTER, MAP_ZOOM, CATEGORY_COLORS } from "../../constants/mapSettings";

const MapStyled = styled(Map)`
  width: 100%;
  height: 700px;
  margin-top: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const GeocodeMap = () => {
  const placemarks = useMemo(() => {
    return RECYCLING_POINTS.map(point => ({
      ...point,
      options: {
        preset: `islands#${point.category}Icon`,
        iconColor: CATEGORY_COLORS[point.category] || '#000'
      }
    }));
  }, []);

  return (
    <MapStyled
      defaultState={{
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
      }}
      modules={["geoObject.addon.balloon"]}
    >
      {placemarks.map(point => (
        <Placemark
          key={point.id}
          geometry={point.coords}
          properties={{
            balloonContentHeader: point.title,
            balloonContentBody: `
              <div style="padding: 10px;">
                <p><strong>Адрес:</strong> ${point.address}</p>
                <p><strong>Режим работы:</strong> ${point.schedule}</p>
                <p><strong>Принимают:</strong> ${point.materials.join(", ")}</p>
                <p><strong>Телефон:</strong> ${point.phone}</p>
              </div>
            `,
            hintContent: point.title
          }}
          options={point.options}
        />
      ))}
      <FullscreenControl />
    </MapStyled>
  );
};

export default GeocodeMap;