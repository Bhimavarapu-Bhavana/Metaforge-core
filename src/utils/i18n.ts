export type Language = 'en' | 'hi' | 'es';

export const i18n = {
  en: {
    components: "Components", deploy: "Deploy", jsonConfig: "JSON Config", preview: "Preview",
    apiEndpoints: "API Endpoints", databaseSchema: "Database Schema", workflows: "Workflows",
    connected: "Connected", notifications: "Notifications", clearAll: "Clear all",
    csvImport: "CSV Import", csvTitle: "Import CSV Data", csvDesc: "Upload a CSV file to auto-generate an app configuration with table schema and CRUD operations.",
    csvDrop: "Drop CSV file here or click to browse", csvSupported: "Supported: .csv files up to 5MB",
    csvPreview: "Data Preview", csvGenerate: "Generate App", csvCancel: "Cancel",
    csvParsing: "Parsing CSV...", csvGenerating: "Generating configuration...",
    loginTitle: "Sign in to MetaForge", email: "Email", password: "Password",
    login: "Sign In", signup: "Sign Up", googleLogin: "Continue with Google",
    githubLogin: "Continue with GitHub", noAccount: "Don't have an account?",
    hasAccount: "Already have an account?", deployTitle: "Deploy Application",
    deployDesc: "Your app will be deployed to a live URL.", deployUrl: "Deployment URL",
    deployBtn: "Deploy Now", deployClose: "Close", deploying: "Deploying...",
    deploySuccess: "Deployed Successfully!", notifAppGen: "App configuration generated",
    notifSchemaCreated: "Database schema created", notifApisReady: "API endpoints ready",
    notifValidationPass: "Validation passed", notifValidationFail: "Validation failed",
    notifDeployed: "App deployed successfully", notifCSVImported: "CSV data imported",
    fields: "Fields", type: "Type", constraints: "Constraints", required: "Required",
    unique: "Unique", primary: "Primary", auto: "Auto", endpoint: "Endpoint",
    method: "Method", description: "Description", workflowName: "Workflow",
    trigger: "Trigger", actions: "Actions", onCreate: "On Create", onUpdate: "On Update",
    onDelete: "On Delete", sendNotification: "Send Notification", validateData: "Validate Data",
    logActivity: "Log Activity", computeField: "Compute Field", noNotifs: "No notifications yet",
    invalidJson: "Invalid JSON syntax", validationError: "Validation Error",
    missingFields: "Missing required fields", unknownComponent: "Unknown component type",
    inconsistentSchema: "Inconsistent schema reference"
  },
  hi: {
    components: "कंपोनेंट्स", deploy: "डिप्लॉय करें", jsonConfig: "JSON कॉन्फ़िग", preview: "प्रीव्यू",
    apiEndpoints: "API एंडपॉइंट्स", databaseSchema: "डेटाबेस स्कीमा", workflows: "वर्कफ़्लो",
    connected: "जुड़ा हुआ", notifications: "सूचनाएं", clearAll: "सभी हटाएं",
    csvImport: "CSV इम्पोर्ट", csvTitle: "CSV डेटा इम्पोर्ट करें", csvDesc: "टेबल स्कीमा और CRUD ऑपरेशन के साथ ऐप कॉन्फ़िगरेशन ऑटो-जनरेट करने के लिए CSV फ़ाइल अपलोड करें।",
    csvDrop: "CSV फ़ाइल यहां ड्रॉप करें या ब्राउज़ करें", csvSupported: "समर्थित: 5MB तक .csv फ़ाइलें",
    csvPreview: "डेटा प्रीव्यू", csvGenerate: "ऐप जनरेट करें", csvCancel: "रद्द करें",
    csvParsing: "CSV पार्स हो रहा है...", csvGenerating: "कॉन्फ़िगरेशन जनरेट हो रहा है...",
    loginTitle: "MetaForge में साइन इन करें", email: "ईमेल", password: "पासवर्ड",
    login: "साइन इन", signup: "साइन अप", googleLogin: "Google से जारी रखें",
    githubLogin: "GitHub से जारी रखें", noAccount: "अकाउंट नहीं है?",
    hasAccount: "पहले से अकाउंट है?", deployTitle: "ऐप्लिकेशन डिप्लॉय करें",
    deployDesc: "आपका ऐप एक लाइव URL पर डिप्लॉय होगा।", deployUrl: "डिप्लॉयमेंट URL",
    deployBtn: "अभी डिप्लॉय करें", deployClose: "बंद करें", deploying: "डिप्लॉय हो रहा:...",
    deploySuccess: "सफलतापूर्वक डिप्लॉय हुआ!", notifAppGen: "ऐप कॉन्फ़िगरेशन जनरेट हुआ",
    notifSchemaCreated: "डेटाबेस स्कीमा बनाई गई", notifApisReady: "API एंडपॉइंट्स तैयार",
    notifValidationPass: "वैलिडेशन पास", notifValidationFail: "वैलिडेशन फेल",
    notifDeployed: "ऐप सफलतापूर्वक डिप्लॉय हुआ", notifCSVImported: "CSV डेटा इम्पोर्ट हुआ",
    fields: "फ़ील्ड्स", type: "टाइप", constraints: "कंस्ट्रेंट्स", required: "ज़रूरी",
    unique: "यूनिक", primary: "प्राइमरी", auto: "ऑटो", endpoint: "एंडपॉइंट",
    method: "मेथड", description: "विवरण", workflowName: "वर्कफ़्लो",
    trigger: "ट्रिगर", actions: "एक्शन्स", onCreate: "बनाने पर", onUpdate: "अपडेट पर",
    onDelete: "हटाने पर", sendNotification: "सूचना भेजें", validateData: "डेटा वैलिडेट करें",
    logActivity: "एक्टिविटी लॉग करें", computeField: "फ़ील्ड कंप्यूट करें", noNotifs: "अभी कोई सूचना नहीं",
    invalidJson: "अमान्य JSON सिंटैक्स", validationError: "वैलिडेशन एरर",
    missingFields: "आवश्यक फ़ील्ड्स गायब", unknownComponent: "अज्ञात कंपोनेंट टाइप",
    inconsistentSchema: "असंगत स्कीमा रेफरेंस"
  },
  es: {
    components: "Componentes", deploy: "Desplegar", jsonConfig: "Config JSON", preview: "Vista previa",
    apiEndpoints: "Endpoints API", databaseSchema: "Esquema BD", workflows: "Flujos",
    connected: "Conectado", notifications: "Notificaciones", clearAll: "Borrar todo",
    csvImport: "Importar CSV", csvTitle: "Importar datos CSV", csvDesc: "Sube un archivo CSV para generar automáticamente una configuración de app con esquema de tabla y operaciones CRUD.",
    csvDrop: "Suelta el archivo CSV aquí o haz clic para explorar", csvSupported: "Soportado: archivos .csv hasta 5MB",
    csvPreview: "Vista previa de datos", csvGenerate: "Generar App", csvCancel: "Cancelar",
    csvParsing: "Analizando CSV...", csvGenerating: "Generando configuración...",
    loginTitle: "Iniciar sesión en MetaForge", email: "Correo", password: "Contraseña",
    login: "Iniciar sesión", signup: "Registrarse", googleLogin: "Continuar con Google",
    githubLogin: "Continuar con GitHub", noAccount: "¿No tienes cuenta?",
    hasAccount: "¿Ya tienes cuenta?", deployTitle: "Desplegar aplicación",
    deployDesc: "Tu app se desplegará en una URL en vivo.", deployUrl: "URL de despliegue",
    deployBtn: "Desplegar ahora", deployClose: "Cerrar", deploying: "Desplegando...",
    deploySuccess: "¡Desplegado exitosamente!", notifAppGen: "Configuración de app generada",
    notifSchemaCreated: "Esquema de BD creado", notifApisReady: "Endpoints API listos",
    notifValidationPass: "Validación aprobada", notifValidationFail: "Validación fallida",
    notifDeployed: "App desplegada exitosamente", notifCSVImported: "Datos CSV importados",
    fields: "Campos", type: "Tipo", constraints: "Restricciones", required: "Requerido",
    unique: "Único", primary: "Primario", auto: "Auto", endpoint: "Endpoint",
    method: "Método", description: "Descripción", workflowName: "Flujo",
    trigger: "Disparador", actions: "Acciones", onCreate: "Al crear", onUpdate: "Al actualizar",
    onDelete: "Al eliminar", sendNotification: "Enviar notificación", validateData: "Validar datos",
    logActivity: "Registrar actividad", computeField: "Calcular campo", noNotifs: "Sin notificaciones aún",
    invalidJson: "Sintaxis JSON inválida", validationError: "Error de validación",
    missingFields: "Campos requeridos faltantes", unknownComponent: "Tipo de componente desconocido",
    inconsistentSchema: "Referencia de esquema inconsistente"
  }
};

export function getTranslation(lang: Language, key: string): string {
  const dict = i18n[lang] as Record<string, string>;
  if (dict && dict[key]) {
    return dict[key];
  }
  const defaultDict = i18n.en as Record<string, string>;
  return defaultDict[key] || key;
}
