import { redirect } from 'next/navigation';
import PrivateSurveyWorkspace from '@/components/encuestas/PrivateSurveyWorkspace';
import { readSurveyAnalysisSession } from '@/lib/survey-analysis-auth';

export default function PrivateSurveyPage() {
  if (!readSurveyAnalysisSession()) redirect('/analisis-encuentas');
  return <PrivateSurveyWorkspace />;
}
