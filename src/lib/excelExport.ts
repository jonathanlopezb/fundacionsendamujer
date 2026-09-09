/**
 * Módulo de Exportación a Microsoft Excel (.xls XML Spreadsheet 2003)
 * Compatible con todas las versiones de Microsoft Excel, LibreOffice y Google Sheets.
 * Genera un archivo con formato de celdas nativo, colores de cabecera y 2 hojas de trabajo:
 * 1. Lista Maestra de Hogares Censados (28 columnas detalladas)
 * 2. Resumen Ejecutivo & Indicadores Comunitarios
 */

export function exportSurveysToExcel(surveys: any[], metrics: any, selectedBarrio: string = 'TODOS') {
  if (!surveys || surveys.length === 0) {
    if (typeof window !== 'undefined') {
      window.alert('No hay encuestas disponibles para exportar a Excel.');
    }
    return;
  }

  const escapeXml = (str: unknown): string => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // XML Header & Styles
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>Fundación Senda Mujer</Author>
  <Created>${new Date().toISOString()}</Created>
  <Company>Fundación Senda Mujer - Caribe Seguro</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#4A0E4E" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="HeaderCol">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#6B21A8" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="RowCell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="RowCellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="BadgeInmediata">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDA4AF"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDA4AF"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDA4AF"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDA4AF"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Bold="1" ss:Color="#9F1239"/>
   <Interior ss:Color="#FFE4E6" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="BadgePrioritaria">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FCD34D"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FCD34D"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FCD34D"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FCD34D"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Bold="1" ss:Color="#92400E"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="BadgeNormal">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6EE7B7"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6EE7B7"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6EE7B7"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6EE7B7"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Bold="1" ss:Color="#065F46"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
  </Style>
 </Styles>
`;

  // HOJA 1: Lista Maestra de Hogares
  xml += ` <Worksheet ss:Name="Hogares Censados">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="70"/>
   <Column ss:Width="130"/>
   <Column ss:Width="95"/>
   <Column ss:Width="85"/>
   <Column ss:Width="75"/>
   <Column ss:Width="65"/>
   <Column ss:Width="65"/>
   <Column ss:Width="65"/>
   <Column ss:Width="80"/>
   <Column ss:Width="180"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="95"/>
   <Column ss:Width="80"/>
   <Column ss:Width="120"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="95"/>
   <Column ss:Width="90"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="100"/>
   <Column ss:Width="80"/>
   <Column ss:Width="220"/>
   <Column ss:Width="80"/>
   <Row ss:Height="30">
    <Cell ss:MergeAcross="27" ss:StyleID="HeaderTitle">
     <Data ss:Type="String">FUNDACIÓN SENDA MUJER — CENSO INTEGRAL Y DIAGNÓSTICO DE HOGARES (${escapeXml(selectedBarrio)})</Data>
    </Cell>
   </Row>
   <Row ss:Height="26">
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Código Ficha</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Barrio</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Manzana</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Punto / Dirección</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Teléfono</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Prioridad</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Riesgo</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Total Hab.</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Menores NNA</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Adultos May.</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Discapacidad</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Integrantes Reportados</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Tenencia Vivienda</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Tiene Título</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Fuente de Agua</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Afiliado EPS</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Enfermedades Crónicas</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">EDA / Parásitos</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Gestante/Lact.</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Citología Cérvix</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Planificación Fam.</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Sospecha ITS</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Alerta VIF/VBG</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Proc. Alimentos</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Fuente Ingresos</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Recibe Subsidio</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Observaciones del Encuestador</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Fecha Censo</Data></Cell>
   </Row>
`;

  surveys.forEach((s) => {
    const priorityStyle =
      s.priority === 'INMEDIATA' ? 'BadgeInmediata' :
      s.priority === 'PRIORITARIA' ? 'BadgePrioritaria' : 'BadgeNormal';

    const integrantesStr = Array.isArray(s.householdMembers) && s.householdMembers.length > 0
      ? s.householdMembers.map((m: any) => `${m.fullName} (${m.relationship}, ${m.age}a)`).join('; ')
      : 'No detallado';

    const fechaVisita = s.visitDate ? new Date(s.visitDate).toISOString().slice(0, 10) : todayStr;

    xml += `   <Row ss:Height="22">
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.surveyCode)}</Data></Cell>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">${escapeXml(s.barrio)}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.manzana || 'S/N')}</Data></Cell>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">${escapeXml(s.landmark || 'Sin dirección')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.contactPhone || 'No registra')}</Data></Cell>
    <Cell ss:StyleID="${priorityStyle}"><Data ss:Type="String">${escapeXml(s.priority)}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.riskLevel || 'BAJO')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${s.householdSize || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${s.minorCount || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${s.elderlyCount || (s.hasElderlyMember ? 1 : 0)}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasDisabledMember ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">${escapeXml(integrantesStr)}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.housingType || 'ARRENDADA')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasHousingDocument ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.waterSource || 'ACUEDUCTO')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.allEPSAffiliated ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">${escapeXml(s.chronicDiseaseDetails || (s.hasChronicDisease ? 'Sí (sin detalle)' : 'Ninguna'))}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasEDAParasites ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasPregnantOrLactating ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.lastPapSmear || 'NUNCA')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(s.familyPlanningMethod || 'NINGUNO')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasSTIHistoryOrSymptoms ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasVIFVBG ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.hasFamilyProcess ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">${escapeXml(s.incomeSource || 'Informal / Rebusque')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${s.receivesSubsidies ? 'SÍ' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">${escapeXml(s.collectorObservations || s.urgentCaseDescription || 'Sin notas adicionales')}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${escapeXml(fechaVisita)}</Data></Cell>
   </Row>
`;
  });

  xml += `  </Table>
 </Worksheet>
`;

  // HOJA 2: Resumen Ejecutivo & Indicadores
  xml += ` <Worksheet ss:Name="Resumen Ejecutivo">
  <Table ss:DefaultRowHeight="22">
   <Column ss:Width="260"/>
   <Column ss:Width="110"/>
   <Column ss:Width="140"/>
   <Row ss:Height="30">
    <Cell ss:MergeAcross="2" ss:StyleID="HeaderTitle">
     <Data ss:Type="String">CONSOLIDADO EPIDEMIOLÓGICO Y SOCIAL — FUNDACIÓN SENDA MUJER</Data>
    </Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Indicador / Variable Territorial</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Valor Absoluto</Data></Cell>
    <Cell ss:StyleID="HeaderCol"><Data ss:Type="String">Proporción Poblacional</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Total Hogares Caracterizados</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.totalHogares || surveys.length}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">100%</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Población Total (Habitantes)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.totalPersonas || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">-</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Infancia &amp; Adolescencia (NNA 0-17 años)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.totalMenores || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalPersonas ? Math.round((metrics.totalMenores / metrics.totalPersonas) * 100) : 0}% de los habitantes</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Adultos Mayores (65+ años)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.totalAdultosMayores || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalPersonas ? Math.round((metrics.totalAdultosMayores / metrics.totalPersonas) * 100) : 0}% de los habitantes</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Personas con Discapacidad</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.personasConDiscapacidad || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">-</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Hogares en Hacinamiento Crítico (&gt;3 pers/hab)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.hacinamientoHogares || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.hacinamientoHogares / metrics.totalHogares) * 100) : 0}% de los hogares</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Sin Acceso a Red de Acueducto Continua</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.sinAcueducto || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.sinAcueducto / metrics.totalHogares) * 100) : 0}% de los hogares</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Viviendas sin Título de Propiedad / Escritura</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.sinTituloVivienda || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.sinTituloVivienda / metrics.totalHogares) * 100) : 0}% de informalidad</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Hogares con Miembros Desafiliados a EPS</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.sinEPS || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.sinEPS / metrics.totalHogares) * 100) : 0}% sin aseguramiento</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Enfermedades Crónicas no Transmisibles (HTA/DBT)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.conEnfermedadCronica || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">-</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Casos Infantiles de EDA y Parásitos</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.ninosInfeccionEda || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">Urgencia pediátrica</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Mujeres con Citología Vencida (&gt;3 años o nunca)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.citologiaCritica || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">Riesgo CaCu</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Sospecha o Síntomas Activos de ITS</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.sospechaITS || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">Tratamiento sindrómico</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Alertas de Violencia Intrafamiliar y de Género (VIF)</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.casosVIF || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">Ruta de Protección activa</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Demandas de Alimentos y Custodia de Menores</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="Number">${metrics.procesosAlimentos || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">Defensoría Pública</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Triaje: Clasificación INMEDIATA (Riesgo Vital)</Data></Cell>
    <Cell ss:StyleID="BadgeInmediata"><Data ss:Type="Number">${metrics.prioridadInmediata || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.prioridadInmediata / metrics.totalHogares) * 100) : 0}% atención ya</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Triaje: Clasificación PRIORITARIA</Data></Cell>
    <Cell ss:StyleID="BadgePrioritaria"><Data ss:Type="Number">${metrics.prioridadAlta || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.prioridadAlta / metrics.totalHogares) * 100) : 0}% en jornada</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="RowCell"><Data ss:Type="String">Triaje: Clasificación NORMAL</Data></Cell>
    <Cell ss:StyleID="BadgeNormal"><Data ss:Type="Number">${metrics.prioridadNormal || 0}</Data></Cell>
    <Cell ss:StyleID="RowCellCenter"><Data ss:Type="String">${metrics.totalHogares ? Math.round((metrics.prioridadNormal / metrics.totalHogares) * 100) : 0}% preventivo</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Censo_Hogares_SendaMujer_${selectedBarrio}_${todayStr}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
