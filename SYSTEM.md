# SYSTEM.md — LingBot-Map Operating System Contract

Version: 2.0
Date: May 2026

## Mission

LingBot-Map is an edge-native real-time spatial intelligence platform that continuously converts multimodal sensor streams into temporally coherent, drift-corrected dense 3D semantic maps.

The system must preserve deterministic behavior under real-world operational constraints including latency, thermal pressure, sensor degradation, and adversarial environmental perturbations.

---

## Core System Principles

### 1. Edge-first execution

No raw perception data leaves the device during normal operation.

Cloud infrastructure is optional and restricted to:
- model training
- fleet telemetry
- signed update distribution
- anonymized federated optimization

Inference remains fully local.

---

### 2. Temporal coherence is a hard invariant

Every component must preserve monotonic timestamp progression.

No component may:
- reorder frames
- retroactively mutate fused state
- violate causal ordering

Temporal coherence has higher priority than reconstruction density.

---

### 3. Safety before completeness

If uncertainty exceeds confidence threshold:
- degrade gracefully
- freeze tile update
- flag uncertainty
- hand control back to deterministic fallback localization

Incorrect geometry is more dangerous than incomplete geometry.

---

### 4. Runtime determinism

Critical runtime paths must have bounded latency.

Target:
- perception loop ≤ 10 ms
- drift correction ≤ 5 ms
- tile update ≤ 3 ms
- safety watchdog ≤ 2 ms

Worst-case latency matters more than average latency.

---

### 5. Model outputs are advisory until validated

Neural predictions never directly mutate persistent spatial state.

All predicted updates pass through:
- geometric consistency validation
- uncertainty gating
- drift sanity checks
- temporal admissibility verification

---

## Non-Negotiable Engineering Constraints

### Memory
- bounded runtime memory
- tile eviction policy mandatory
- no unbounded graph accumulation

### Compute
- thermal-aware scheduling mandatory
- degraded mode required
- scheduler must preserve control-loop responsiveness

### Reliability
- crash-safe persistent map snapshots
- rollback-capable OTA
- A/B partition deployment

---

## Failure Behavior

When anomaly detected:
1. quarantine incoming frame
2. preserve previous trusted map
3. emit structured event
4. trigger fallback localization
5. surface diagnostics to observability plane

The system must fail safely, not silently.

---

## Security Model

### Trust boundaries

Trusted:
- signed runtime binaries
- signed model weights
- verified schema contracts
- secure boot environment

Untrusted:
- sensor input
- external plugins
- map merge payloads
- fleet communication channels

---

## Governance Requirements

Every release must contain:
- model card
- dataset lineage
- SBOM
- signed provenance attestation
- benchmark regression report

No unsigned artifact may enter production.

---

## Definition of Production Readiness

LingBot-Map is production-ready only when it demonstrates:

- stable sub-10 ms local inference
- bounded drift under long-horizon traversal
- safe degradation under sensor failure
- deterministic runtime behavior
- reproducible deployment
- observable failure semantics
