import { Head } from '@inertiajs/react';
import type { LatLngExpression } from 'leaflet';
import {
    Map,
    MapTileLayer,
    MapZoomControl,
    MapSearchControl,
    MapMarkerClusterGroup,
    MapMarker,
} from '@/components/ui/map';

OrdersMap.layout = {
    breadcrumbs: [{ title: 'Map (TODO)' }],
};

export default function OrdersMap() {
    const TORONTO_COORDINATES = [43.6532, -79.3832] satisfies LatLngExpression;
    const CLUSTER_POINTS = [
        { position: [43.6632, -79.3832] },
        { position: [43.6642, -79.3842] },
        { position: [43.6622, -79.3852] },
        { position: [43.6652, -79.3822] },
        { position: [43.6612, -79.3812] },
        { position: [43.6432, -79.3932] },
        { position: [43.6442, -79.3942] },
        { position: [43.6422, -79.3952] },
    ] satisfies { position: LatLngExpression }[];

    return (
        <>
            <Head title="Map" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Map
                    center={TORONTO_COORDINATES}
                    zoom={12}
                    className="h-full w-full"
                >
                    <MapTileLayer />
                    <MapMarkerClusterGroup>
                        {CLUSTER_POINTS.map((point, i) => (
                            <MapMarker key={i} position={point.position} />
                        ))}
                    </MapMarkerClusterGroup>
                    <MapSearchControl position="top-1 left-1 " />
                    <MapZoomControl position="bottom-1 right-1" />
                </Map>
            </div>
        </>
    );
}
