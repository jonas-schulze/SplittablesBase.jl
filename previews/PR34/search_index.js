var documenterSearchIndex = {"docs":
[{"location":"#SplittablesBase.jl-1","page":"Home","title":"SplittablesBase.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"SplittablesBase\nSplittablesBase.halve\nSplittablesBase.amount\nSplittablesBase.Testing.test_ordered\nSplittablesBase.Testing.test_unordered","category":"page"},{"location":"#SplittablesBase","page":"Home","title":"SplittablesBase","text":"SplittablesBase: a simple API for parallel computation on collections\n\n(Image: Dev) (Image: GitHub Actions)\n\nSplittablesBase.jl defines a simple set of APIs:\n\nhalve(collection): splitting given collection roughly in half.\namount(collection): an \"approximation\" of length.\n\nThese are the basis of parallel algorithms that can be derived from reduce.  Custom containers can support many parallel algorithms by simply defining these functions.\n\nSplittablesBase.jl also defines an experimental simple test utility functions SplittablesBase.Testing.test_ordered(examples) and SplittablesBase.Testing.test_unordered(examples) where some automatable tests are run against each example container in examples.  This utility function is planned to be moved out to a separate package.\n\nSee more in the documentation.\n\nSupported collections\n\nhalve methods for following collections in Base are implemented in SplittablesBase.jl:\n\nAbstractArray\nAbstractString\nDict\nkeys(::Dict)\nvalues(::Dict)\nSet\nTuple\nNamedTuple\nzip\nBase.Generator\nIterators.filter\nIterators.flatten\nIterators.partition\nIterators.product\nIterators.enumerate\nskipmissing\n\nPackages using SplittablesBase.jl\n\nTransducers.jl\nThreadsX.jl\n\nSee also\n\nSpliterator<T> trySplit() (Java)\n\n\n\n\n\n","category":"module"},{"location":"#SplittablesBase.halve","page":"Home","title":"SplittablesBase.halve","text":"SplittablesBase.halve(collection) -> (left, right)\n\nSplit collection (roughly) in half.\n\nExamples\n\njulia> using SplittablesBase: halve\n\njulia> halve([1, 2, 3, 4])\n([1, 2], [3, 4])\n\nImplementation\n\nImplementations of halve on custom collections must satisfy the following laws.\n\n(1) If the original collection is ordered, concatenating the sub-collections returned by halve must create a collection that is equivalent to the original collection.  More precisely,\n\nisequal(\n    vec(collect(collection)),\n    vcat(vec(collect(left)), vec(collect(right))),\n)\n\nmust hold.\n\nSimilar relationship must hold for unordered collections; i.e., taking union of left and right collections as multiset must create a collection that is equivalent to the original collection as a multiset:\n\nusing StatsBase: countmap\nisequal(\n    countmap(collect(collection)),\n    merge(+, countmap(collect(left)), countmap(collect(right))),\n)\n\n(2) halve must eventually shorten the collection.  More precisely, the following function must terminate:\n\nfunction recursive_halve(collection)\n    length(collection) == 0 && return\n    left, right = halve(collection)\n    recursive_halve(left)\n    recursive_halve(right)\nend\n\nFurthermore, whenever implementable with cheap operations, length(left) should be close to length(collection) ÷ 2 as much as possible.\n\n\n\n\n\n","category":"function"},{"location":"#SplittablesBase.amount","page":"Home","title":"SplittablesBase.amount","text":"SplittablesBase.amount(collection) :: Int\n\nReturn the number of elements in collection or rough \"estimate\" of it.\n\nExamples\n\njulia> using SplittablesBase: amount\n\njulia> amount([1, 2, 3, 4])\n4\n\njulia> amount(\"aえ𝑖∅υ\")\n12\n\njulia> length(\"aえ𝑖∅υ\")  # != `amount`\n5\n\nNote that amount on strings is not equal to length because the latter cannot be computed in O(1) time.\n\nImplementation\n\nImplementations of amount on a collection must satisfy the following laws.\n\n(1) Any empty collection must have zero amount.\n\n(2) Any operation that increments length on collection must increments amount.\n\nIdeally, the time-complexity of amount should be O(1).\n\n\n\n\n\n","category":"function"},{"location":"#SplittablesBase.Testing.test_ordered","page":"Home","title":"SplittablesBase.Testing.test_ordered","text":"SplittablesBase.Testing.test_ordered(examples)\nSplittablesBase.Testing.test_unordered(examples)\n\nRun interface tests on each test case in examples.\n\nexamples is an iterator where each element is either:\n\nA container to be tested.\nA NamedTuple with following keys\n:label: A label used for Test.@testcase.\n:data: A container to be tested.\n\nExamples\n\njulia> using SplittablesBase\n\njulia> SplittablesBase.Testing.test_ordered([\n           (label = \"First Test\", data = 1:5),\n           (label = \"Second Test\", data = (a = 1, b = 2, c = 3)),\n           zip(1:3, 4:6),\n       ]);\nTest Summary: | Pass  Total\nFirst Test    |    2      2\nTest Summary: | Pass  Total\nSecond Test   |    2      2\nTest Summary: | Pass  Total\n3             |    2      2\n\n\n\n\n\n","category":"function"},{"location":"#SplittablesBase.Testing.test_unordered","page":"Home","title":"SplittablesBase.Testing.test_unordered","text":"test_unordered(examples)\n\nSee test_ordered.\n\n\n\n\n\n","category":"function"}]
}
