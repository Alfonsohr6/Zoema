/**
 * Configuración inmutable exclusiva para la Sede Arequipa.
 * Contiene la información corporativa y la lista de enlaces CSV
 * publicados por pestaña/hoja desde Google Sheets.
 */
const SEDE_CONFIG = {
    sedeId: "arequipa",
    nombreSede: "Arequipa",
    
    // Mapeo de URLs CSV por cada categoría u hoja
    csvUrls: {
        VEN_DepaCasa: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVhPu6Rqbu4WJoULG_XTRlAneimiXT0Vtd1YQSIA-mYP_VdTwyOoZp3ZOMWk6DFWHYQsI8ml7uEHzn/pub?gid=0&single=true&output=csv",
        VEN_Terreno: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVhPu6Rqbu4WJoULG_XTRlAneimiXT0Vtd1YQSIA-mYP_VdTwyOoZp3ZOMWk6DFWHYQsI8ml7uEHzn/pub?gid=1886403118&single=true&output=csv",
        ALQ_DepaCasa: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVhPu6Rqbu4WJoULG_XTRlAneimiXT0Vtd1YQSIA-mYP_VdTwyOoZp3ZOMWk6DFWHYQsI8ml7uEHzn/pub?gid=2001795377&single=true&output=csv",
        ALQ_Terreno: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVhPu6Rqbu4WJoULG_XTRlAneimiXT0Vtd1YQSIA-mYP_VdTwyOoZp3ZOMWk6DFWHYQsI8ml7uEHzn/pub?gid=470414165&single=true&output=csv",
        REM_DepaCasa: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVhPu6Rqbu4WJoULG_XTRlAneimiXT0Vtd1YQSIA-mYP_VdTwyOoZp3ZOMWk6DFWHYQsI8ml7uEHzn/pub?gid=855830057&single=true&output=csv",
        REM_Terreno: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVhPu6Rqbu4WJoULG_XTRlAneimiXT0Vtd1YQSIA-mYP_VdTwyOoZp3ZOMWk6DFWHYQsI8ml7uEHzn/pub?gid=1169196957&single=true&output=csv"
    },

    // Información de contacto y ubicación
    whatsappNum: "51953395647",
    mensajeWaDefault: "Hola Zoema, deseo recibir información técnica sobre una propiedad del catálogo de Arequipa.",
    telefonoContacto: "+51 953 395 647", //+51 976 299 889
    direccionOficina: "Av. La Paz 409-A, 3er Piso, Cercado, Arequipa",
    horarioAtencion: "Lunes a Viernes de 09:00 a 18:00 horas",
    googleMapsOficina: "https://maps.app.goo.gl/RHgbfZdDfSay68CD6"
};