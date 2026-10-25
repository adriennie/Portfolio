// Recorded output of the log-triage README runs; sample lines are copied verbatim from data/HDFS_2k.log.
export const logTriageReplay = {
  "source": "data/HDFS_2k.log (Loghub HDFS_2k)",
  "command": "python -m logtriage.cli stream data/HDFS_2k.log --chunk-size 500",
  "chunks": [
    {
      "index": 1,
      "lines": 500,
      "cumulative": 500,
      "templates": 10,
      "anomalies": 9,
      "latencyMs": 1716.3,
      "guardrail": "PASSED",
      "sample": [
        {
          "n": 12,
          "text": "081109 204815 653 INFO dfs.DataNode$DataXceiver: Receiving block blk_5792489080791696128 src: /10.251.30.6:33145 dest: /10.251.30.6:50010"
        },
        {
          "n": 70,
          "text": "081109 213436 13 INFO dfs.DataBlockScanner: Verification succeeded for blk_-2827716238972737794"
        },
        {
          "n": 95,
          "text": "081109 222342 3462 WARN dfs.DataNode$DataXceiver: 10.251.74.79:50010:Got exception while serving blk_2244903517044280975 to /10.251.74.134:"
        },
        {
          "n": 176,
          "text": "081110 002337 13 INFO dfs.DataBlockScanner: Verification succeeded for blk_-1547954353065580372"
        },
        {
          "n": 178,
          "text": "081110 003441 4986 INFO dfs.DataNode$DataXceiver: Receiving block blk_-2015110815660478655 src: /10.251.35.1:53344 dest: /10.251.35.1:50010"
        },
        {
          "n": 347,
          "text": "081110 085042 13 INFO dfs.DataBlockScanner: Verification succeeded for blk_-1383276859207001328"
        }
      ]
    },
    {
      "index": 2,
      "lines": 500,
      "cumulative": 1000,
      "templates": 12,
      "anomalies": 24,
      "latencyMs": 82.9,
      "guardrail": "PASSED",
      "sample": [
        {
          "n": 512,
          "text": "081110 104407 9110 INFO dfs.DataNode$PacketResponder: PacketResponder 2 for block blk_859668537217019080 terminating"
        },
        {
          "n": 595,
          "text": "081110 114309 29 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/root/randtxt2/_temporary/_task_200811101024_0002_m_000299_0/part-00299. blk_4984150784048864430"
        },
        {
          "n": 678,
          "text": "081110 123810 11328 INFO dfs.DataNode$DataXceiver: Receiving block blk_6628512193350164674 src: /10.251.73.220:33460 dest: /10.251.73.220:50010"
        },
        {
          "n": 761,
          "text": "081110 150618 30 INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: blockMap updated: 10.251.73.188:50010 is added to blk_-3897674589140998025 size 67108864"
        },
        {
          "n": 844,
          "text": "081110 210243 14482 INFO dfs.DataNode$PacketResponder: Received block blk_-8214089520956286311 of size 67108864 from /10.251.26.131"
        },
        {
          "n": 927,
          "text": "081110 212509 34 INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: blockMap updated: 10.251.123.33:50010 is added to blk_-6442394521537090621 size 67108864"
        }
      ]
    },
    {
      "index": 3,
      "lines": 500,
      "cumulative": 1500,
      "templates": 13,
      "anomalies": 11,
      "latencyMs": 77.0,
      "guardrail": "PASSED",
      "sample": [
        {
          "n": 1012,
          "text": "081110 220911 19 INFO dfs.FSDataset: Deleting block blk_6542592144596063478 file /mnt/hadoop/dfs/data/current/subdir35/blk_6542592144596063478"
        },
        {
          "n": 1095,
          "text": "081110 230314 16898 INFO dfs.DataNode$PacketResponder: PacketResponder 0 for block blk_157913239647511296 terminating"
        },
        {
          "n": 1178,
          "text": "081111 024105 17911 INFO dfs.DataNode$PacketResponder: Received block blk_-6811519872198278365 of size 67108864 from /10.250.6.4"
        },
        {
          "n": 1261,
          "text": "081111 033444 18940 INFO dfs.DataNode$DataXceiver: Receiving block blk_-1690784932539647416 src: /10.251.31.180:50205 dest: /10.251.31.180:50010"
        },
        {
          "n": 1344,
          "text": "081111 043106 31 INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: blockMap updated: 10.251.71.193:50010 is added to blk_4577632468651859430 size 67108864"
        },
        {
          "n": 1427,
          "text": "081111 045623 31 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/root/rand5/_temporary/_task_200811101024_0011_m_000040_0/part-00040. blk_1253515519191706153"
        }
      ]
    },
    {
      "index": 4,
      "lines": 500,
      "cumulative": 2000,
      "templates": 17,
      "anomalies": 8,
      "latencyMs": 78.4,
      "guardrail": "PASSED",
      "sample": [
        {
          "n": 1512,
          "text": "081111 061602 31 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/root/randtxt5/_temporary/_task_200811101024_0012_m_001192_0/part-01192. blk_7720864196601815614"
        },
        {
          "n": 1595,
          "text": "081111 065445 19 INFO dfs.FSDataset: Deleting block blk_2473550781612396886 file /mnt/hadoop/dfs/data/current/subdir54/blk_2473550781612396886"
        },
        {
          "n": 1678,
          "text": "081111 073406 23140 INFO dfs.DataNode$PacketResponder: Received block blk_-8310554294841246175 of size 67108864 from /10.251.123.132"
        },
        {
          "n": 1761,
          "text": "081111 080645 23938 INFO dfs.DataNode$DataXceiver: Receiving block blk_-8323785930877970805 src: /10.250.13.240:40589 dest: /10.250.13.240:50010"
        },
        {
          "n": 1844,
          "text": "081111 085906 27 INFO dfs.FSNamesystem: BLOCK* NameSystem.delete: blk_-3894803026385053344 is added to invalidSet of 10.251.43.21:50010"
        },
        {
          "n": 1927,
          "text": "081111 093703 25622 INFO dfs.DataNode$PacketResponder: PacketResponder 0 for block blk_3378157549705391333 terminating"
        }
      ]
    }
  ],
  "citations": [
    {
      "block": "blk_-1383276859207001328",
      "line": 347,
      "score": -0.0587
    },
    {
      "block": "blk_-1547954353065580372",
      "line": 176,
      "score": -0.0587
    },
    {
      "block": "blk_-2827716238972737794",
      "line": 70,
      "score": -0.0587
    }
  ]
};
