# ARCHITECTURE.md — LingBot-Map Technical Architecture

Version: 2.0

## Architectural thesis

LingBot-Map is a streaming spatial foundation system.

The architecture is event-driven, tile-based, and edge-native.

---

## Core runtime graph

Sensor Ingestion
→ Temporal Synchronizer
→ Feature Encoder
→ Geometric Context Transformer
→ Drift Correction Head
→ Tile Fusion Engine
→ Semantic Volumetric Map
→ Application APIs

---

## Primary components

### Sensor ingestion layer

Supported modalities:
- RGB
- depth
- IMU
- event camera
- optional lidar
- optional radar

Responsibilities:
- timestamp normalization
- calibration validation
- frame admissibility checks
- out-of-distribution detection

---

### Temporal synchronizer

Responsible for:
- monotonic sequencing
- bounded buffering
- late-frame rejection
- clock drift handling

No unordered frame may pass beyond this layer.

---

### Feature encoder

Produces compact geometric embeddings.

Outputs:
- feature tensors
- confidence estimates
- modality reliability weights

---

### Geometric context transformer

Primary intelligence layer.

Consumes:
- current frame embeddings
- historical tile context
- temporal latent memory

Produces:
- drift vectors
- canonicalized feature alignment
- uncertainty estimates

---

### Drift correction head

Outputs:
- SE(3) correction proposal
- confidence interval
- admissibility score

Correction is provisional until validated.

---

### Tile fusion engine

World model storage abstraction.

Tile characteristics:
- sparse
- bounded
- versioned
- independently mutable
- mergeable

Tile size:
2–5 m³ recommended.

Responsibilities:
- write arbitration
- temporal merge
- version snapshots
- conflict rejection

---

### Semantic volumetric layer

Maintains:
- occupancy
- structural surfaces
- semantic classes
- dynamic object masks

---

## Runtime control plane

### Scheduler

Handles:
- thermal adaptation
- compute budget enforcement
- tile prioritization
- steady-state inference throttling

---

### Safety watchdog

Monitors:
- drift growth
- timestamp violations
- entropy spikes
- sensor dropout
- memory pressure

Triggers fallback when necessary.

---

## External interfaces

### Robotics

- ROS 2 node
- pose stream
- tile query
- confidence diagnostics

### AR/VR

- Unity plugin
- Unreal plugin
- world-anchor persistence
- semantic occlusion surfaces

---

## Data plane

Canonical transport:
- protobuf
- FlatBuffers for low-latency paths

Canonical entities:
- Frame
- FeatureVolume
- DriftToken
- MapTile
- RuntimeEvent
- CalibrationState

---

## Deployment topology

### Training plane
- A100/H100 cluster
- distributed FSDP
- experiment registry

### Edge plane
- Jetson Orin
- Qualcomm RB6
- future ASIC targets

### Fleet plane
- OTA service
- telemetry broker
- federated aggregation

---

## Architectural invariants

The architecture must preserve:

- temporal causality
- bounded memory
- deterministic failure semantics
- local-first inference
- map consistency under degradation
