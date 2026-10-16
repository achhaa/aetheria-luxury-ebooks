import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const audioDir = path.join(rootDir, 'public', 'assets', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const wavPath = path.join(audioDir, 'the-artificial-mind-chapter-01.wav');
const jsonPath = path.join(rootDir, 'src', 'data', 'the-artificial-mind-chapter-01-timing.json');

const textToSpeak = `The Threshold of Agency. Beyond Statistical Next-Token Interpolation. For more than a decade, the primary engine of modern artificial intelligence has been autoregression, the mathematically elegant yet cognitively restricted task of predicting the subsequent token in a textual sequence. Trained over petabyte-scale corpora of human discourse, these networks developed astonishing surface fluency. They could mimic legal contracts, write sonnets in iambic pentameter, and generate syntactically immaculate Python code. Yet practitioners frequently encountered an unsettling fragility. A model capable of explaining quantum electrodynamics might fail at simple planning puzzles requiring four sequential steps of physical causation. The root of this dissonance lies in the distinction between correlation and deliberation. A next-token predictor does not maintain an internal state machine testing hypotheses against reality; it navigates a manifold of likelihood. The Architecture of Deliberative Inference. The emergence of sovereign reasoning architectures represents a structural departure from unconstrained feed-forward emission. Rather than directly sampling output tokens from the initial latent representation, modern cognitive pipelines introduce an intermediate deliberation phase. In this space, the system operates not as a typewriter, but as a theorem prover. True artificial agency begins not when a system speaks fluently, but when it possesses the structural capacity to pause, simulate consequences in a sandboxed scratchpad, and discard its own initial deductions. Consider an agent tasked with auditing a cryptographic consensus protocol. Under pure autoregression, the model emits judgments based on semantic similarity to known vulnerability disclosures. Under an agentic deliberation graph, the model decomposes the protocol into state transitions, writes formal verification lemmas, executes them in an ephemeral container, and refines its thesis based on machine execution traces. Dual-Stream Memory: Epistemic versus Episodic. A critical bottleneck in early deployments was context degradation. While raw context windows expanded to hundreds of thousands of tokens, passive ingestion proved insufficient for coherent long-horizon execution. Unstructured text windows suffer from attentional noise and loss of continuity across multiple execution days. Robust systems resolve this through a dual-stream architecture. The episodic stream logs fine-grained interactions, timestamps, and transient environmental states. Parallel to this, an epistemic distillation layer periodically extracts stable invariant principles, committing them to a directed knowledge graph. When an agent acts, it queries not raw chat logs, but verified conceptual models. Dual-stream memory models demonstrate substantial consistency improvements over unstructured large-context prompts in long-horizon autonomous workflows.`;

// PowerShell script with inline C# event handler to capture precise word timings
const psScript = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.Volume = 100

$words = [System.Collections.Generic.List[PSObject]]::new()

$handler = {
    param($sender, $e)
    $obj = [PSCustomObject]@{
        word = $e.Text
        start = [Math]::Round($e.AudioPosition.TotalSeconds, 3)
        characterPosition = $e.CharacterPosition
        characterCount = $e.CharacterCount
    }
    $words.Add($obj)
}

$synth.add_SpeakProgress($handler)
$synth.SetOutputToWaveFile('${wavPath.replace(/\\/g, '\\\\')}')

$text = @"
${textToSpeak}
"@

$synth.Speak($text)
$synth.Dispose()

# Calculate 'end' timestamp for each segment
for ($i = 0; $i -lt $words.Count; $i++) {
    if ($i -lt $words.Count - 1) {
        $words[$i] | Add-Member -NotePropertyName 'end' -NotePropertyValue $words[$i+1].start
    } else {
        $words[$i] | Add-Member -NotePropertyName 'end' -NotePropertyValue ([Math]::Round($words[$i].start + 0.6, 3))
    }
}

$output = [PSCustomObject]@{
    bookId = 'the-artificial-mind'
    chapterId = 'chapter-01'
    audioUrl = '/assets/audio/the-artificial-mind-chapter-01.wav'
    transcriptVersion = '1.0'
    totalSegments = $words.Count
    durationSeconds = $words[$words.Count - 1].end
    segments = $words
}

$output | ConvertTo-Json -Depth 5 | Out-File -FilePath '${jsonPath.replace(/\\/g, '\\\\')}' -Encoding utf8
Write-Host "SUCCESS: Generated audio and $($words.Count) word timestamps."
`;

const tempPs = path.join(__dirname, 'temp_generate.ps1');
fs.writeFileSync(tempPs, psScript, 'utf-8');

try {
  console.log('Generating audiobook audio and real word timing map...');
  const res = execSync(`powershell -ExecutionPolicy Bypass -File "${tempPs}"`, { encoding: 'utf-8' });
  console.log(res);
} finally {
  if (fs.existsSync(tempPs)) fs.unlinkSync(tempPs);
}
