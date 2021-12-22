// {
//     $project: {
//       result: { 
//           $reduce: { 
//               input: '$reports', 
//               initialValue: [], 
//               in: {
//                 'totalAmount': { 
//                   $sum: {
//                     $cond: [
//                       {
//                         $and:[{ $gte: ['$reports.soldAt', Helpers.getCurrentTimestamp(0)]}, { $lte: ['$reports.soldAt', Helpers.getCurrentEndDate()] }]
//                       }, '$reports.totalAmount', 0
//                     ]
//                   }
//                 },
//                 'amountPayed': {
//                   $sum: {
//                     $cond: [
//                       {
//                         $and:[{ $lte: ['$reports.soldAt', Helpers.getCurrentTimestamp(0)]}, {$lte: ['$reports.soldAt', Helpers.getCurrentEndDate()] }]
//                       }, '$reports.paymentMade', 0
//                     ]
//                   }
//                 }
//               }
//           }
//       }
//     }
//   }





// var todayOutstandingSales = await Customer.aggregate([
//     {
//       $match: { 'reports.paid': false, 'reports.soldAt': { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
//     },
//     {
//       $project: {
//         result: { 
//             $reduce: { 
//                 input: '$reports', 
//                 initialValue: [], 
//                 in: {
//                   'totalAmount': { 
//                     $sum: {
//                       $cond: { 
//                         if: { $gte: ['$reports.soldAt', Helpers.getCurrentEndDate()] },
//                         then: '$reports.totalAmount',
//                         else: 0 
//                       }
//                     }
//                   },
//                   'amountPayed': {
//                     $sum: {
//                       $cond: { 
//                         if: { $gte: ['$reports.soldAt', Helpers.getCurrentEndDate()] },
//                         then: '$reports.paymentMade',
//                         else: 0 
//                       }
//                     }
//                   }
//                 }
//             }
//         }
//       }
//     }
//   ])
//   console.log(todayOutstandingSales)
//   const todayOutstandingBalance = Helpers.getTotalOutstandingBalanceValue(todayOutstandingSales)
//   console.log(todayOutstandingBalance)