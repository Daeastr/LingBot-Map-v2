# TASKS.md — Initial Execution Backlog

## Milestone 0 — Baseline validation

### Tasks

- implement minimal geometric context transformer
- reproduce KITTI baseline
- benchmark against ORB-SLAM3
- deploy TensorRT prototype on Jetson
- define drift evaluation protocol

Exit criteria:
- measurable drift improvement
- reproducible latency benchmark

---

## Milestone 1 — Runtime skeleton

### Tasks

- define protobuf contracts
- implement temporal synchronizer
- create tile abstraction
- build bounded runtime buffer
- create deterministic scheduler

Exit criteria:
- end-to-end frame ingestion pipeline operational

---

## Milestone 2 — Core learning pipeline

### Tasks

- training dataset ingestion
- DVC setup
- experiment registry
- geometric token training
- uncertainty calibration

Exit criteria:
- first stable streaming checkpoint

---

## Milestone 3 — Edge deployment

### Tasks

- ONNX export
- TensorRT optimization
- kernel profiling
- thermal degradation mode
- memory pressure tests

Exit criteria:
- stable sub-10 ms edge inference

---

## Milestone 4 — Safety hardening

### Tasks

- confidence gating
- drift watchdog
- sensor anomaly rejection
- rollback-safe map persistence
- structured fault events

Exit criteria:
- safe degraded execution demonstrated

---

## Milestone 5 — Platform integration

### Tasks

- ROS 2 integration
- Unity integration
- tile query API
- map subscription API
- observability broker

Exit criteria:
- usable external developer surface

---

## Milestone 6 — Field validation

### Tasks

- warehouse pilot
- dynamic lighting tests
- motion blur stress tests
- thermal endurance runs
- long-horizon drift validation

Exit criteria:
- field stability confirmed

---

## Milestone 7 — Productionization

### Tasks

- OTA pipeline
- artifact signing
- fleet rollout controls
- model cards
- release governance package

Exit criteria:
- production deployment readiness
