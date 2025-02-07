import { FullscreenControl, Map, Placemark, useYMaps } from "@pbe/react-yandex-maps";
import { useState } from "react";
import styled from "styled-components";

const MapStyled = styled(Map)`
width: 100%;
height: 700px;
margin-top: 80px;
`;

const CENTER = [53.34881098009905, 83.77624821208886];
const ZOOM = 12;

const GeocodeMap = () => {
    const [coordinates, setCoordinates] = useState(null);
    const [address, setAddress] = useState(null);

    const ymaps = useYMaps(["geocode"]);

    const handleClickMap = (e) => {
        const coords = e.get("coords");

        if (coords) {
            setCoordinates(coords);
        }

        ymaps.geocode(coords).then((result) => {
            const foundAddress = handleGeoResult(result);
            
            if (foundAddress) setAddress(foundAddress);
        }).catch(() => {
            console.error("Ошибка");
            setAddress(null);
        });
    };

    function handleGeoResult(result) {
        const firstGeoObject = result.geoObjects.get(0);

        if (firstGeoObject) {
            const properties = firstGeoObject.properties;

            const location = String(properties.get("description", {}));
            const route = String(properties.get("name", {}));

            const foundAddress = {
                location,
                route,
            };
            return foundAddress;
        }
    }

    return (
        <MapStyled
            defaultState={{
                center: CENTER,
                zoom: ZOOM,
            }}
            onClick={(e) => handleClickMap(e)}
        >
            {coordinates && <Placemark geometry={coordinates} />}
            <FullscreenControl />
        </MapStyled>
    );
};

export default GeocodeMap;